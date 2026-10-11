import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Fingerprint,
  GitBranch,
  Handshake,
  Layers,
  Lock,
  Minus,
  Plug,
  Scale,
  Shield,
  ShieldAlert,
  Terminal,
  Trophy,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { AuthControls } from "../components/auth/AuthControls";
import { Logo } from "../components/brand/Logo";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const PILOT_MAILTO = "mailto:info@agntpymt.com?subject=AgntPymt%20design%20partner%20pilot";

const traction = [
  {
    icon: Trophy,
    value: "Ripple Aquarium",
    label: "Selected for Ripple's Aquarium program.",
  },
  {
    icon: BadgeCheck,
    value: "3 chains live",
    label: "Deployed on Arbitrum Sepolia, Robinhood Chain testnet, and Base Sepolia.",
  },
  {
    icon: Plug,
    value: "6 MCP tools",
    label: "Any MCP-capable agent can pay through the gateway today. No SDK required.",
  },
  {
    icon: Handshake,
    value: "3 pilot slots",
    label: "Opening for December: design partners in BFSI, fintech, and crypto.",
  },
];

const onboardingPrompt = `Connect yourself to AgntPymt so every payment you make follows our company's spend policy.

1. Add an MCP server named "agntpymt":
   URL: https://<your-gateway-host>/mcp
   Header: Authorization: Bearer $AGNTPYMT_MCP_KEY (read it from the environment)
2. Call agntpymt_get_agent_policy with agentId "<your-agent-id>" and tell me your spend limits.
3. From now on, make every purchase with agntpymt_initiate_purchase. Never pay a vendor any other way.
4. Never ask me to paste a private key or API key into this chat.`;

const problems = [
  {
    icon: Fingerprint,
    title: "No agent identity",
    description:
      "When an autonomous agent buys an API, a dataset, or a vendor service, finance cannot answer a basic question: who actually made this purchase?",
  },
  {
    icon: ShieldAlert,
    title: "No spend governance",
    description:
      "Corporate cards and API keys were built for humans. They cannot cap a fleet of agents, kill a rogue workflow, or enforce an allowlist at machine speed.",
  },
  {
    icon: FileText,
    title: "No regulator-grade audit trail",
    description:
      "Chat logs and SaaS dashboards will not satisfy BFSI, fintech, or supply-chain compliance. Enterprises need an immutable record before they let AI transact.",
  },
];

const stats = [
  {
    value: "33%",
    label:
      "of enterprise software applications will include agentic AI by 2028 — up from less than 1% in 2024.",
    source: "Gartner, 2025",
  },
  {
    value: "15%",
    label:
      "of day-to-day work decisions will be made autonomously through agentic AI by 2028 — from 0% in 2024.",
    source: "Gartner, 2025",
  },
  {
    value: ">40%",
    label:
      "of agentic AI projects will be cancelled by the end of 2027, due to costs, unclear ROI, or inadequate risk controls.",
    source: "Gartner, June 2025",
  },
  {
    value: "97%",
    label:
      "of organisations that reported an AI-related breach lacked proper AI access controls.",
    source: "IBM Cost of a Data Breach 2025",
  },
];

const pillars = [
  {
    icon: Fingerprint,
    title: "Verified agent identity",
    description:
      "Every agent gets a governed wallet and a verifiable identity. Spend is attributed to a named agent, not a shared key.",
  },
  {
    icon: Shield,
    title: "Programmable spend policy",
    description:
      "Auto-approve thresholds, 24-hour caps, an org-wide ceiling, and a kill switch are enforced by the gateway before any payment is signed.",
  },
  {
    icon: UserCheck,
    title: "Human-in-the-loop approvals",
    description:
      "Transactions under the cap settle instantly. Anything above threshold routes to a human — at machine speed, not ticket speed.",
  },
  {
    icon: FileText,
    title: "Regulator-grade audit trail",
    description:
      "Every authorize, approve, settle, and reject decision is logged with its settlement hash, and can be anchored on Arbitrum for independent verification.",
  },
  {
    icon: Zap,
    title: "Rail-agnostic settlement",
    description:
      "x402 micropayments in USDC on Arbitrum today, with more EVM chains and XRPL next. The control plane stays the same as rails expand.",
  },
  {
    icon: Building2,
    title: "Runs on your servers",
    description:
      "Deploy the gateway in your own cloud or data centre. Agent keys stay with you, and AgntPymt never holds or moves your funds.",
  },
];

const controlSteps = [
  {
    title: "Agent requests",
    detail: "An agent proposes a purchase over MCP — an API call, a dataset, or a vendor invoice.",
  },
  {
    title: "Policy decides",
    detail: "The gateway checks identity, spend caps, the kill switch, and whether a human must approve.",
  },
  {
    title: "Settle and log",
    detail: "The payment clears in USDC and the decision is written to the audit trail, optionally anchored on Arbitrum.",
  },
];

const demoFlows = [
  {
    title: "Auto-approve + negotiate",
    agent: "Research Agent",
    detail: "Buys sector data — seller quotes $0.02, agent counters $0.01, settles instantly.",
  },
  {
    title: "Instant micro-pay",
    agent: "Procurement Agent",
    detail: "Orders office supplies at $0.01 — under policy limit, no approval needed.",
  },
  {
    title: "Human approval",
    agent: "Cloud Ops Agent",
    detail: "AWS invoice negotiated to $0.08 — exceeds $0.05 limit → routed for approval.",
  },
];

const deployments = [
  {
    chain: "Arbitrum Sepolia",
    chainId: 421614,
    address: "0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c",
    explorerLabel: "Arbiscan",
    explorerHref: "https://sepolia.arbiscan.io/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c",
    verifiedLabel: "Sourcify exact match",
    verifiedHref: "https://repo.sourcify.dev/421614/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c",
    footnote: "Settles in USDC 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  },
  {
    chain: "Robinhood Chain testnet",
    chainId: 46630,
    address: "0x7F67212561DcD231a9316a54A4A336F7059A4234",
    explorerLabel: "Robinhood explorer",
    explorerHref:
      "https://explorer.testnet.chain.robinhood.com/address/0x7F67212561DcD231a9316a54A4A336F7059A4234#code",
    verifiedLabel: "Source verified",
    verifiedHref:
      "https://explorer.testnet.chain.robinhood.com/address/0x7F67212561DcD231a9316a54A4A336F7059A4234#code",
    footnote: "Govern agents wherever tokenized assets live.",
  },
];

const policyEvents = [
  "Agent binding",
  "Auto-authorize under cap",
  "Human approval",
  "Settlement",
  "Cancel",
  "Over-limit rejection",
];

const marketTiles = [
  {
    value: "$15T",
    title: "B2B purchases by agents",
    description:
      "Gartner forecasts AI agents will intermediate more than $15 trillion in B2B spending by 2028 — 90% of business purchases.",
    source: "Gartner IT Symposium/Xpo 2025",
  },
  {
    value: "$53B",
    title: "The larger enterprise prize",
    description:
      "Agentic AI in supply-chain software is projected to grow from under $2B in 2025 to $53B by 2030. B2B is the real market.",
    source: "Gartner, 2026",
  },
  {
    value: "EU AI Act + DORA",
    title: "Regulation is already here",
    description:
      "Regulated industries cannot wait for consumer agent-pay rails. They need identity, policy, and audit before agents spend.",
    source: "EU AI Act · DORA",
  },
];

const roadmap = [
  { year: "Today", title: "Pilot governance", detail: "Run the self-hosted gateway with design partners, settling USDC on Arbitrum." },
  { year: "2027", title: "Enterprise standard", detail: "The control layer every regulated org requires before production agents." },
  { year: "2030", title: "Default M2M rail", detail: "The Visa moment for machine-to-machine payments — built for enterprises first." },
];

type CompareCell = { kind: "yes" | "no" | "partial"; text: string };

const compareRows: { capability: string; consumer: CompareCell; traditional: CompareCell; agntpymt: CompareCell }[] = [
  {
    capability: "Org-level policy engine",
    consumer: { kind: "partial", text: "Checkout rules" },
    traditional: { kind: "yes", text: "Human cards" },
    agntpymt: { kind: "yes", text: "Per-agent, enforced in code" },
  },
  {
    capability: "Self-hosted, non-custodial",
    consumer: { kind: "no", text: "Vendor cloud" },
    traditional: { kind: "no", text: "Issuer holds funds" },
    agntpymt: { kind: "yes", text: "Your servers, your keys" },
  },
  {
    capability: "Agent identity",
    consumer: { kind: "no", text: "User session" },
    traditional: { kind: "no", text: "Employee ID" },
    agntpymt: { kind: "yes", text: "Named agent wallet" },
  },
  {
    capability: "Multi-agent fleets",
    consumer: { kind: "no", text: "Single shopper" },
    traditional: { kind: "no", text: "One cardholder" },
    agntpymt: { kind: "yes", text: "Fleet treasury" },
  },
  {
    capability: "Human approvals",
    consumer: { kind: "partial", text: "Confirm in app" },
    traditional: { kind: "yes", text: "Ticket queues" },
    agntpymt: { kind: "yes", text: "Threshold routing" },
  },
  {
    capability: "Regulator-grade audit",
    consumer: { kind: "no", text: "Merchant logs" },
    traditional: { kind: "partial", text: "ERP export" },
    agntpymt: { kind: "yes", text: "Audit log + on-chain anchor" },
  },
  {
    capability: "Compliance readiness",
    consumer: { kind: "no", text: "Consumer UX" },
    traditional: { kind: "partial", text: "Human-centric" },
    agntpymt: { kind: "yes", text: "BFSI-ready" },
  },
  {
    capability: "Machine-speed micropayments",
    consumer: { kind: "yes", text: "Agent checkout" },
    traditional: { kind: "no", text: "Batch settlement" },
    agntpymt: { kind: "yes", text: "x402 + USDC" },
  },
];

const moats = [
  {
    icon: Lock,
    title: "Enforced, not trusted",
    detail: "Limits are checked before a payment is signed, and the agent never holds the key. No prompt can talk its way past a cap or the kill switch.",
  },
  {
    icon: Layers,
    title: "Rail-agnostic control plane",
    detail: "x402 and USDC on Arbitrum today, more EVM chains and XRPL next. The same governance layer as settlement rails change.",
  },
  {
    icon: Scale,
    title: "Compliance-first by design",
    detail: "Identity, approvals, and the audit trail are the product — not a later add-on.",
  },
];

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be unavailable; fail closed */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition duration-200 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      aria-label={copied ? "Address copied" : `Copy contract address ${address}`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
    </button>
  );
}

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be unavailable; fail closed */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy prompt"}</span>
    </button>
  );
}

function DemoLink({ className, children }: { className: string; children: ReactNode }) {
  if (!clerkEnabled) {
    return (
      <Link to="/dashboard" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <SignedIn>
        <Link to="/dashboard" className={className}>
          {children}
        </Link>
      </SignedIn>
      <SignedOut>
        <Link to="/sign-in" className={className}>
          {children}
        </Link>
      </SignedOut>
    </>
  );
}

function CompareMark({ cell }: { cell: CompareCell }) {
  const Icon = cell.kind === "yes" ? Check : cell.kind === "no" ? X : Minus;
  const tone =
    cell.kind === "yes" ? "text-emerald-400" : cell.kind === "no" ? "text-slate-500" : "text-amber-300";

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-300">
      <Icon className={`h-4 w-4 shrink-0 ${tone}`} aria-hidden />
      <span className="sr-only">
        {cell.kind === "yes" ? "Yes" : cell.kind === "no" ? "No" : "Partial"}
        {": "}
      </span>
      {cell.text}
    </span>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link to="/" className="cursor-pointer rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400">
            <Logo variant="dark" markClassName="h-9 w-9" />
          </Link>
          <div className="flex items-center gap-3">
            <AuthControls />
            <DemoLink className="btn-primary cursor-pointer">
              {clerkEnabled ? (
                <>
                  <SignedIn>Dashboard</SignedIn>
                  <SignedOut>Launch demo</SignedOut>
                </>
              ) : (
                "Launch demo"
              )}
            </DemoLink>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl text-center">
            <a
              href="#traction"
              className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-100 transition duration-200 hover:border-brand-400/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              <Trophy className="h-4 w-4" aria-hidden />
              Selected for Ripple&apos;s Aquarium
            </a>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Let your AI agents spend.
              <span className="mt-2 block bg-gradient-to-r from-brand-400 to-cyan-200 bg-clip-text text-transparent">
                Without losing control.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              AgntPymt is the self-hosted payment gateway for enterprise AI agents. Spend limits,
              human approvals, and a regulator-grade audit trail, running on your own servers and
              settling in stablecoins.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <DemoLink className="btn-primary-lg cursor-pointer">
                Launch live demo
                <ArrowRight className="h-5 w-5" aria-hidden />
              </DemoLink>
              <a
                href="#pilot"
                className="cursor-pointer rounded-xl border border-white/15 px-6 py-3 text-base font-medium text-slate-300 transition duration-200 hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
              >
                Become a design partner
              </a>
            </div>
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand-400" aria-hidden />
                Self-hosted, non-custodial
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-400" aria-hidden />
                Policy before every payment
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand-400" aria-hidden />
                Plugs into any agent via MCP
              </li>
              <li>
                <a
                  href="#live-on-arbitrum"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-brand-100 transition duration-200 hover:border-brand-400/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                >
                  <GitBranch className="h-4 w-4" aria-hidden />
                  Settles on Arbitrum
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section id="traction" className="border-t border-white/10 px-6 py-16 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Traction
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Early proof. Shipping fast.
            </h2>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {traction.map(({ icon: Icon, value, label }) => (
                <li key={value} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                  <Icon className="h-5 w-5 text-brand-400" aria-hidden />
                  <p className="mt-4 bg-gradient-to-r from-brand-400 to-cyan-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                    {value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="why-it-matters" className="border-t border-white/10 bg-slate-900/50 px-6 py-24 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              The problem
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Agents are ready to spend. Enterprises aren&apos;t ready to let them.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              Consumer agent checkout is getting the headlines. Regulated enterprises still cannot
              put a wallet in an agent&apos;s hands without identity, policy, and proof.
            </p>
            <blockquote className="mx-auto mt-10 max-w-3xl border-l-4 border-brand-500 pl-6 text-left text-xl font-medium leading-relaxed text-white sm:text-2xl">
              Telling an AI &ldquo;don&apos;t spend more than $10&rdquo; is a suggestion, not a control.
              Models hallucinate, get prompt-injected, and misread instructions. With a funded wallet,
              one bad output is a payment you can&apos;t undo.
            </blockquote>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {problems.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              The impact
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Without governance, the agent economy stalls at the pilot stage.
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {stats.map((stat) => (
                <figure key={stat.value} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="bg-gradient-to-r from-brand-400 to-cyan-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{stat.label}</p>
                  <figcaption className="mt-4 text-xs text-slate-500">{stat.source}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-slate-900/50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              The solution
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              One control plane for every agent transaction.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              AgntPymt is the financial control layer enterprises must have before autonomous
              procurement, IT spend, or digital-service consumption goes live.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition duration-200 hover:border-brand-500/30"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="connect" className="px-6 py-24 scroll-mt-24">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Onboarding
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              One prompt. Your agent is governed.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              No SDK and no integration project. Paste this into Claude, Cursor, Hermes, or any
              MCP-capable agent, then set its limits in the dashboard. The agent can read its limits,
              but only a human can change them.
            </p>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Terminal className="h-4 w-4 text-brand-400" aria-hidden />
                  Setup prompt
                  <span className="rounded-md bg-brand-500/15 px-2 py-0.5 text-xs font-medium text-brand-200">
                    Early access
                  </span>
                </span>
                <CopyPromptButton text={onboardingPrompt} />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-slate-200">
                {onboardingPrompt}
              </pre>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/10 bg-slate-900/50 px-6 py-24 scroll-mt-24">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              How it works
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Request. Govern. Settle.
            </h2>
            <ol className="mt-14 grid gap-6 sm:grid-cols-3">
              {controlSteps.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-400">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.detail}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 space-y-4">
              {demoFlows.map((flow, i) => (
                <div
                  key={flow.title}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-slate-900/80 p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-400">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{flow.title}</h3>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        {flow.agent}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{flow.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <DemoLink className="inline-flex cursor-pointer items-center gap-2 text-brand-400 transition duration-200 hover:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400">
                Open the dashboard and run a flow
                <ArrowRight className="h-4 w-4" aria-hidden />
              </DemoLink>
            </div>
          </div>
        </section>

        <section id="live-on-arbitrum" className="border-t border-white/10 px-6 py-24 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Live on Arbitrum
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Not a mockup. Deployed and verified.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              Agent payments settle in USDC on Arbitrum. For enterprises that want an independent
              audit trail, the gateway mirrors every decision to AgentSpendPolicy, live and
              source-verified on two Arbitrum chains.
            </p>
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {deployments.map((d) => (
                <article key={d.address} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{d.chain}</h3>
                      <p className="text-xs text-slate-500">Chain ID {d.chainId}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                      Source verified
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">
                    AgentSpendPolicy
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-2">
                    <span className="min-w-0 flex-1 font-mono text-sm text-slate-200" title={d.address}>
                      {shortAddress(d.address)}
                    </span>
                    <CopyAddressButton address={d.address} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a
                      href={d.explorerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center gap-1.5 text-brand-400 transition duration-200 hover:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                    >
                      {d.explorerLabel}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <a
                      href={d.verifiedHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center gap-1.5 text-brand-400 transition duration-200 hover:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                    >
                      {d.verifiedLabel}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">{d.footnote}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-400">
              The contract re-checks limits and records {policyEvents.join(" · ").toLowerCase()}.
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 bg-slate-900/50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              The potential
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              The agent economy needs its Visa moment — for enterprises.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              Consumer agentic commerce is the story everyone is telling. The money, the risk,
              and the regulation sit in B2B.
            </p>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {marketTiles.map((tile) => (
                <figure key={tile.title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                  <p className="bg-gradient-to-r from-brand-400 to-cyan-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                    {tile.value}
                  </p>
                  <h3 className="mt-3 font-semibold text-white">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{tile.description}</p>
                  <figcaption className="mt-4 text-xs text-slate-500">{tile.source}</figcaption>
                </figure>
              ))}
            </div>
            <ol className="mt-12 grid gap-4 sm:grid-cols-3">
              {roadmap.map((step) => (
                <li key={step.year} className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{step.year}</p>
                  <h3 className="mt-2 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Competitive advantage
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Everyone else is building for consumers. We&apos;re building for the enterprise.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              Visa, Mastercard, and consumer agent-pay rails optimize checkout. Corporate cards
              optimize employees. Neither was designed for a fleet of machines that spend.
            </p>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-left">
                <caption className="sr-only">
                  Comparison of consumer agent checkout, traditional spend management, and AgntPymt
                </caption>
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Capability
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Consumer agent checkout
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Traditional spend management
                    </th>
                    <th scope="col" className="bg-brand-500/10 px-4 py-3 font-semibold text-brand-200">
                      AgntPymt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.capability} className="border-b border-white/10">
                      <th scope="row" className="px-4 py-4 text-sm font-medium text-white">
                        {row.capability}
                      </th>
                      <td className="px-4 py-4">
                        <CompareMark cell={row.consumer} />
                      </td>
                      <td className="px-4 py-4">
                        <CompareMark cell={row.traditional} />
                      </td>
                      <td className="bg-brand-500/5 px-4 py-4">
                        <CompareMark cell={row.agntpymt} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {moats.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                  <Icon className="h-5 w-5 text-brand-400" aria-hidden />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pilot"
          className="border-t border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-24 scroll-mt-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Design partners
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Be one of our first three design partners.
            </h2>
            <p className="mt-4 text-slate-400">
              We&apos;re opening three pilot slots for December: a 4–8 week proof of value around one
              agent payment flow, with your policy rules, approvals, and audit receipts, running on
              your own infrastructure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={PILOT_MAILTO} className="btn-primary-lg cursor-pointer px-8 py-3.5">
                Book a pilot
                <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
              <DemoLink className="cursor-pointer rounded-xl border border-white/15 px-6 py-3 text-base font-medium text-slate-300 transition duration-200 hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400">
                Launch live demo
              </DemoLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>Your agents are moving fast. Your controls should too.</p>
          <p>Enterprise payment infrastructure for the agent economy</p>
        </div>
      </footer>
    </div>
  );
}
