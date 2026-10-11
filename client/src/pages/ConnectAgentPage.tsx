import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Eye, EyeOff, Plug, Wrench } from "lucide-react";
import { api, type Agent, type AgentPolicy } from "../lib/api";
import { DISPLAY_CHAIN } from "../lib/chains";
import { Spinner } from "../components/ui/Skeleton";

type McpIntegration = {
  serverName: string;
  mcpUrl: string;
  serviceKey: string;
  tools: { name: string; description: string }[];
};

type ClientKey = "cursor" | "claudeCode" | "claudeDesktop" | "other";

const CLIENTS: { key: ClientKey; label: string; hint: string }[] = [
  { key: "cursor", label: "Cursor", hint: "Add to ~/.cursor/mcp.json (or .cursor/mcp.json in a project)." },
  { key: "claudeCode", label: "Claude Code", hint: "Run once in your terminal." },
  {
    key: "claudeDesktop",
    label: "Claude Desktop",
    hint: "Settings → Developer → Edit Config, add to claude_desktop_config.json, then restart Claude.",
  },
  { key: "other", label: "Other MCP client", hint: "Any client that supports Streamable HTTP MCP servers." },
];

function mcpConfigSnippet(client: ClientKey, mcp: McpIntegration, key: string): string {
  const auth = `Bearer ${key}`;
  switch (client) {
    case "cursor":
      return JSON.stringify(
        { mcpServers: { [mcp.serverName]: { url: mcp.mcpUrl, headers: { Authorization: auth } } } },
        null,
        2
      );
    case "claudeCode":
      return `claude mcp add --transport http ${mcp.serverName} ${mcp.mcpUrl} --header "Authorization: ${auth}"`;
    case "claudeDesktop":
      return JSON.stringify(
        {
          mcpServers: {
            [mcp.serverName]: {
              command: "npx",
              args: ["-y", "mcp-remote", mcp.mcpUrl, "--header", "Authorization:${AGNTPYMT_AUTH}"],
              env: { AGNTPYMT_AUTH: auth },
            },
          },
        },
        null,
        2
      );
    case "other":
      return [`Transport:  Streamable HTTP`, `URL:        ${mcp.mcpUrl}`, `Header:     Authorization: ${auth}`].join(
        "\n"
      );
  }
}

function agentPrompt(agent: Agent, policy: AgentPolicy | undefined): string {
  const limits = [
    policy ? `auto-approved up to $${policy.autoApproveLimitUsd} per payment` : null,
    policy?.dailyAggregateCapUsd != null ? `daily cap $${policy.dailyAggregateCapUsd}` : null,
    `settles in USDC on ${DISPLAY_CHAIN.name}`,
  ]
    .filter(Boolean)
    .join("; ");

  return `You are "${agent.name}", an AI agent that spends company money only through AgntPymt, the payment gateway that enforces your organization's spending policy.

Your AgntPymt agent ID is: ${agent.id}
Pass "agentId": "${agent.id}" in every agntpymt_* tool call.

Your policy: ${limits}. Larger payments need a human approver.

How to pay for anything (APIs, data, compute, SaaS, invoices):
1. Before your first purchase, call agntpymt_get_agent_policy to confirm your wallet and limits.
2. Call agntpymt_initiate_purchase with a clear purchaseIntent (what you are buying and why) and maxBudget in USD when you know it. For premium data or compute, use agntpymt_request_paid_resource.
3. Act on the result status:
   - "completed": tell the user what was bought, the amount, the vendor and the transaction hash.
   - "pending_approval": tell the user a human must approve it in AgntPymt. Do not retry it.
   - "denied": explain the reason. Do not try to work around the policy.
   - "error": report the error. Retry at most once.
4. Use agntpymt_list_pending_approvals and agntpymt_list_transactions to check status and history.

Rules:
- Never pay, sign or move funds any other way, and never ask for private keys.
- Never split a purchase to stay under the auto-approve limit.
- If the agntpymt tools are not available, stop and ask the user to connect the AgntPymt MCP server.

Start now: call agntpymt_get_agent_policy and summarise what you are allowed to spend.`;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
      <code>{code}</code>
    </pre>
  );
}

function StepHeader({ n, title, desc, action }: { n: number; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a8e8] text-sm font-semibold text-white">
          {n}
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export function ConnectAgentPage() {
  const [mcp, setMcp] = useState<McpIntegration | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [policies, setPolicies] = useState<AgentPolicy[]>([]);
  const [agentId, setAgentId] = useState("");
  const [client, setClient] = useState<ClientKey>("cursor");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      api<McpIntegration>("/api/integrations/mcp"),
      api<Agent[]>("/api/agents"),
      api<AgentPolicy[]>("/api/policies"),
    ])
      .then(([m, a, p]) => {
        setMcp(m);
        setAgents(a);
        setPolicies(p);
        setAgentId((current) => current || a[0]?.id || "");
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load MCP settings"));
  }, []);

  const agent = agents.find((a) => a.id === agentId);
  const policy = policies.find((p) => p.agentId === agentId);
  const prompt = useMemo(() => (agent ? agentPrompt(agent, policy) : ""), [agent, policy]);

  if (!mcp) {
    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      );
    }
    return <Spinner label="Loading MCP settings…" />;
  }

  const clientInfo = CLIENTS.find((c) => c.key === client)!;
  const realSnippet = mcpConfigSnippet(client, mcp, mcp.serviceKey);
  const maskedKey = `${mcp.serviceKey.slice(0, 4)}${"•".repeat(Math.max(mcp.serviceKey.length - 4, 8))}`;
  const shownSnippet = showKey ? realSnippet : mcpConfigSnippet(client, mcp, maskedKey);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Integrations</p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Plug className="h-6 w-6 text-[#00a8e8]" />
          Connect an agent
        </h1>
        <p className="mt-1 max-w-2xl text-slate-500">
          Plug any MCP-capable agent (Cursor, Claude, Hermes, LangChain…) into AgntPymt. It gets payment tools,
          and every spend goes through your policies, approvals and kill switch.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <StepHeader n={1} title="Pick the agent" desc="The agent's identity, wallet and spend limits the prompt will use." />
        {agents.length === 0 ? (
          <p className="text-sm text-slate-500">No agents yet. Create one under Agents first.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {agents.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAgentId(a.id)}
                className={`rounded-lg border-2 px-3 py-2 text-left text-sm transition ${
                  a.id === agentId
                    ? "border-[#00a8e8] bg-[#00a8e8]/5 font-semibold text-slate-900"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {a.name}
                <span className="ml-2 text-xs font-normal text-slate-400">{a.category}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <StepHeader
          n={2}
          title="Add the AgntPymt MCP server"
          desc={clientInfo.hint}
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showKey ? "Hide key" : "Show key"}
              </button>
              <CopyButton text={realSnippet} />
            </div>
          }
        />
        <div className="mb-3 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          {CLIENTS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setClient(c.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                c.key === client ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <CodeBlock code={shownSnippet} />
        <p className="mt-2 text-xs text-slate-500">
          The key authorizes calls to your gateway. Treat it like a password and keep it out of shared repos.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <StepHeader
          n={3}
          title="Paste this prompt into the agent"
          desc="Tells the agent who it is, its limits, and to route every payment through AgntPymt."
          action={prompt ? <CopyButton text={prompt} label="Copy prompt" /> : undefined}
        />
        {prompt ? (
          <CodeBlock code={prompt} />
        ) : (
          <p className="text-sm text-slate-500">Pick an agent to generate its prompt.</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
          <Wrench className="h-4 w-4 text-slate-500" />
          Tools the agent gets
        </h2>
        <div className="divide-y divide-slate-100">
          {mcp.tools.map((t) => (
            <div key={t.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5">
              <code className="text-sm font-medium text-slate-800">{t.name}</code>
              <span className="text-sm text-slate-500">{t.description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
