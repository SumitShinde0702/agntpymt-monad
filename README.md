<div align="center">

<img src="docs/assets/banner.svg" alt="AgntPymt: governed stablecoin payments for AI agents, self-hosted" width="100%" />

<a href="https://github.com/SumitShinde0702/agntpymt-arbitrum">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&duration=3000&pause=900&color=00A8E8&center=true&vCenter=true&width=760&lines=You+can't+prompt+your+way+to+compliance.;Rules+in+code%2C+not+in+prompts.;Your+servers.+Your+keys.+Your+rules.;Consumer+agents+need+a+wallet.+Enterprise+agents+need+a+rulebook." alt="Typing tagline" />
</a>

<p>
  <a href="https://testnet.monadexplorer.com/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c"><img src="https://img.shields.io/badge/Monad_Testnet-USDC_settlement_%2B_audit-836EF9?style=for-the-badge&logo=ethereum&logoColor=white" alt="USDC settlement and audit anchor on Monad testnet" /></a>
  <a href="https://sepolia.arbiscan.io/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c"><img src="https://img.shields.io/badge/Arbitrum_Sepolia-USDC_settlement_%2B_audit-12AAFF?style=for-the-badge&logo=ethereum&logoColor=white" alt="USDC settlement and audit anchor on Arbitrum Sepolia" /></a>
  <a href="https://explorer.testnet.chain.robinhood.com/address/0x7F67212561DcD231a9316a54A4A336F7059A4234#code"><img src="https://img.shields.io/badge/Robinhood_Chain-deployed-00C805?style=for-the-badge&logo=robinhood&logoColor=white" alt="Deployed on Robinhood Chain testnet" /></a>
  <a href="https://repo.sourcify.dev/421614/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c"><img src="https://img.shields.io/badge/Source-verified-34D399?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Source verified on Sourcify" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Self--hosted-non--custodial-0F172A?style=flat-square" alt="Self-hosted and non-custodial" />
  <img src="https://img.shields.io/badge/MCP-agent_integration-6E56CF?style=flat-square" alt="MCP" />
  <img src="https://img.shields.io/badge/x402-USDC-2775CA?style=flat-square" alt="x402 USDC" />
  <img src="https://img.shields.io/badge/ERC--8004-identity_%26_reputation-0B2D5C?style=flat-square" alt="ERC-8004" />
  <img src="https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat-square&logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/viem-1E1E20?style=flat-square" alt="viem" />
</p>

<p>
  <a href="#-the-problem">Problem</a> ·
  <a href="#-the-solution">Solution</a> ·
  <a href="#-how-it-works">How it works</a> ·
  <a href="#-plug-in-any-agent-over-mcp">MCP</a> ·
  <a href="#-deployed-contracts">Contracts</a> ·
  <a href="#-quick-start">Quick start</a> ·
  <a href="#-demo-flows">Demo</a>
</p>

</div>

---

## 🚨 The problem

AI agents can now buy API calls, data and SaaS, and pay invoices on their own. Telling an AI *"don't spend more than $10"* is a suggestion, not a control: models hallucinate, get prompt-injected, and misread instructions. When an agent holds a funded wallet, one bad output becomes a real payment you can't undo.

No bank, fintech or supply chain will hand an LLM a funded wallet without the controls it applies to employees: **spending limits, approvals, a kill switch and an audit trail**. So today enterprises either block agent payments entirely, or hard-code a private key and hope for the best.

> Most agent-payment work targets consumers: one agent buying for one person. **AgntPymt is built for the enterprise:** fleets of agents spending company money, under rules a regulator can audit.

## 🛡️ The solution

AgntPymt is a **self-hosted payment gateway that sits between an enterprise's AI agents and its money**. The agent decides what it wants to buy. AgntPymt decides whether it's allowed, then settles in stablecoins over [x402](https://x402.org).

It runs on the enterprise's own servers. Policy checks happen in the gateway at API speed, agent keys never leave the company's infrastructure, and AgntPymt the company never holds or moves customer funds.

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🪪 Agent identity</h3>
      Every agent gets its own wallet and an <b>ERC-8004</b> identity. Every dollar is tied to a named agent, not a shared key.
    </td>
    <td width="50%" valign="top">
      <h3>📜 Rules in code, not in prompts</h3>
      The gateway enforces auto-approve thresholds, rolling 24-hour caps, an org-wide exposure ceiling and a kill switch <b>before any payment is signed</b>. The LLM never holds the key, so no prompt can talk its way past a limit.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🙋 Human-in-the-loop</h3>
      Small spends settle instantly. Anything above the threshold waits in the approvals queue for a human, at machine speed rather than ticket speed.
    </td>
    <td width="50%" valign="top">
      <h3>🧾 Regulator-grade audit</h3>
      Every decision (authorize, escalate, approve, deny, settle) is logged with the x402 settlement hash. Enterprises that want a tamper-proof public record can anchor it on Monad with <code>AgentSpendPolicy</code>.
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <h3>🔎 Know who you're paying</h3>
      Before any money moves, the seller's wallet is screened against its payment history on Monad (<b>Alchemy</b> Transfers API). Brand-new wallets with no history go to a human, with the reason shown on the approval; established wallets, and the org's own configured payout wallet (<code>EVM_PAY_TO_ADDRESS</code>), settle under the normal limits. Optionally, <b>Nansen</b> wallet labels add a deny rule for sellers flagged as exploiters, scammers or sanctioned (<code>NANSEN_ENABLED=true</code>).
    </td>
  </tr>
</table>

### 🏢 Why self-hosted and non-custodial

- **Your servers, your keys, your rules.** Banks and fintechs won't route agent spend through a third party's cloud. AgntPymt deploys into their own environment (Docker image included).
- **We never touch the money.** The enterprise's agents pay vendors directly in stablecoins. AgntPymt is software, not a payment intermediary.
- **Fast by default.** Policy runs in-process at the gateway, so a $0.01 API call isn't held up waiting for a block. On-chain anchoring is opt-in.

### ⛓️ Where the chain comes in

- **Settlement:** USDC over x402 on Monad testnet (`eip155:10143`), through Monad's x402 facilitator. The gateway is rail-agnostic: set `SETTLEMENT_CHAIN` to `arbitrumSepolia` or `baseSepolia` to run on those instead.
- **Identity and reputation:** agents and sellers are registered on the **ERC-8004** registries, and every seller is rated after settlement.
- **Optional audit anchor:** `AgentSpendPolicy` mirrors the gateway's decisions on-chain (request, approve, settle, cancel) so an auditor can verify the trail on the Monad explorer without trusting the enterprise's database. It's also deployed and verified on Arbitrum Sepolia and Robinhood Chain testnet.

#### Monad testnet settings

| | |
| --- | --- |
| Chain | Monad Testnet, chain ID `10143`, gas token MON ([faucet](https://faucet.monad.xyz)) |
| RPC | Alchemy `https://monad-testnet.g.alchemy.com/v2/<key>` when `ALCHEMY_API_KEY` is set, otherwise `https://testnet-rpc.monad.xyz` (override either with `MONAD_TESTNET_RPC_URL`) |
| USDC | `0x534b2f3A21130d7a60830c2Df862319e593943A3` |
| x402 facilitator | `https://x402-facilitator.molandak.org` (x402 v2, `exact` scheme) |
| ERC-8004 | Identity `0x8004A818BFB912233c491871b3d84c89A494BD9e`, Reputation `0x8004B663056A597Dffe9eCcC1965A193B7388713` |

## 🔄 How it works

```mermaid
sequenceDiagram
    autonumber
    participant A as 🤖 Agent (any MCP client)
    participant P as 🛡️ AgntPymt gateway (enterprise servers)
    participant H as 🙋 Human approver
    participant N as 🔎 Alchemy (+ Nansen, optional)
    participant X as 💸 x402 facilitator (USDC)
    participant C as 📜 AgentSpendPolicy (optional, Monad)
    participant R as ⭐ ERC-8004 reputation

    A->>P: agntpymt_initiate_purchase("Buy premium sector data")
    P->>P: Kill switch, org ceiling, 24h cap, auto-approve threshold
    P->>P: Negotiate with seller
    P->>N: Screen seller wallet (labels + on-chain history)
    N-->>P: Risk tier
    alt flagged by Nansen (when enabled)
        P-->>A: Denied, no payment
    end
    opt on-chain audit enabled
        P->>C: requestSpend(agent, vendor, amount)
    end
    alt amount ≤ auto-approve and seller not high risk
        P-->>A: Authorized
    else over threshold or high-risk seller
        P->>H: Approval request in UI (with risk reason)
        H->>P: Approve
    end
    P->>X: Agent wallet pays seller in USDC
    X-->>P: Settlement tx hash
    opt on-chain audit enabled
        P->>C: markSettled(id, txHash)
    end
    P->>R: Rate the seller
```

## 🔌 Plug in any agent over MCP

AgntPymt ships an MCP server, so any agent that speaks MCP (Claude, Cursor, Hermes, LangChain and others) can pay through the gateway without an SDK integration:

| Tool | What it does |
| --- | --- |
| `agntpymt_get_agent_policy` | The agent's identity, wallet and spend limits |
| `agntpymt_initiate_purchase` | Match a vendor, enforce policy, negotiate and settle |
| `agntpymt_request_paid_resource` | Buy premium data or compute through the gateway |
| `agntpymt_list_pending_approvals` | Purchases waiting on a human |
| `agntpymt_list_transactions` | The agent's audit ledger |
| `agntpymt_list_agents` | Agents in the org |

The goal is one-prompt onboarding: a company pastes a setup prompt into its existing agent, the agent connects to AgntPymt, and a human sets its limits in the dashboard. Limits are always set by a human; the agent can only read them.

### 📜 `AgentSpendPolicy.sol`: optional on-chain audit anchor ([`contracts/`](contracts/))

For enterprises that want their auditor to verify the trail independently, the gateway mirrors each decision to this contract. The contract re-checks the same limits, so a buggy or compromised gateway can't record a spend that breaks policy without the contract rejecting it.

| Feature | How |
| --- | --- |
| 🪪 **Agent binding** | Org admin binds an agent wallet with an **EIP-712 consent signature from the agent**, so nobody can claim someone else's agent address |
| 📏 **Limits** | Per-tx cap, rolling-day cap, auto-approve threshold (invariant: `auto ≤ perTx ≤ daily`) |
| 🙋 **Human-in-the-loop** | Spends above the threshold are `PendingApproval` until the admin calls `approve()`; they expire after 3 days |
| 🛑 **Kill switches** | Per-agent `setAgentActive(false)` and org-wide `setOrgFrozen(true)`; both also block settlement of already-authorized spends |
| 🔑 **Operators** | Admin can delegate request/settle to a backend (AgntPymt), so agents need no gas |
| 💸 **Settlement** | `markSettled(id, x402TxHash)` for off-contract x402 payments, or `execute(id)` to pull USDC agent → vendor via `transferFrom` |
| 🔒 **Safety** | OpenZeppelin `SafeERC20`, `ReentrancyGuard`, `SignatureChecker` (EOA + ERC-1271), custom errors, checks-effects-interactions |

## 🌐 Deployed contracts

| Network | AgentSpendPolicy | Token | Source verified |
| --- | --- | --- | --- |
| **Monad Testnet** (10143) | [`0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c`](https://testnet.monadexplorer.com/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c) | USDC `0x534b2f3A21130d7a60830c2Df862319e593943A3` | ✅ [Sourcify exact match](https://repo.sourcify.dev/10143/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c) |
| **Arbitrum Sepolia** (421614) | [`0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c`](https://sepolia.arbiscan.io/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c) | USDC `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d` | ✅ [Sourcify exact match](https://repo.sourcify.dev/421614/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c) |
| **Robinhood Chain testnet** (46630) | [`0x7F67212561DcD231a9316a54A4A336F7059A4234`](https://explorer.testnet.chain.robinhood.com/address/0x7F67212561DcD231a9316a54A4A336F7059A4234#code) | MockUSDC [`0x542A…0e1c`](https://explorer.testnet.chain.robinhood.com/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c#code) | ✅ Blockscout |

ERC-8004 registries (same address on Monad testnet and Arbitrum Sepolia): Identity `0x8004A818BFB912233c491871b3d84c89A494BD9e`, Reputation `0x8004B663056A597Dffe9eCcC1965A193B7388713`.

Deployment records: [`contracts/deployments/`](contracts/deployments/).

<details>
<summary><b>🧪 Contracts: test and deploy</b></summary>

```bash
cd contracts
npm install
npm test                          # 16 tests: binding, limits, approvals, kill switches, settlement
npm run deploy:monad-testnet      # needs DEPLOYER_PRIVATE_KEY with Monad testnet MON
npm run verify:sourcify -- monadTestnet
npm run deploy:arbitrum-sepolia   # needs DEPLOYER_PRIVATE_KEY with Arbitrum Sepolia ETH
npm run deploy:robinhood-testnet
npm run export-abi                # refresh server/src/chain/spend-policy-abi.ts
```

Server integration smoke test against any RPC (local Hardhat node or Monad testnet):

```bash
SPEND_POLICY_ADDRESS=0x... SPEND_POLICY_ADMIN_PRIVATE_KEY=0x... npx tsx server/scripts/smoke-spend-policy.ts
```

</details>

## 🚀 Quick start

```bash
# 1. Copy env (single root .env for client + server)
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start PostgreSQL (Docker)
npm run db:up

# 4. Build db package, migrate & seed
npm run build -w db
npm run db:migrate
npm run db:seed

# 5. Start dev (client :5173 + server :3001)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The landing page is at [`/home`](http://localhost:5173/home).

All variables live in **one root `.env`** file. Vite reads `VITE_*` keys via `envDir: '..'` in `client/vite.config.ts`, and the server loads the same file from the repo root.

Optional keys for the seller risk check:

| Variable | What it enables |
| --- | --- |
| `ALCHEMY_API_KEY` | Alchemy's Monad RPC for the server and Hardhat (the public RPC stays as a fallback), plus the seller's payment history (Transfers API) used to spot brand-new wallets. Without it the check is skipped and never blocks a payment. Enable **Monad Testnet** on your Alchemy app. |
| `NANSEN_ENABLED`, `NANSEN_API_KEY` | Off by default. When `NANSEN_ENABLED=true`, Nansen wallet labels are added to the check and flagged sellers are denied. Each lookup costs Nansen credits. |

## 🎬 Demo flows

Micro-payments default to **$0.01 USDC** (`DEMO_TRANSACTION_FEE_USD` in `.env`). Re-seed after pricing changes: `npm run db:seed`.

| # | Flow | Agent | What happens |
| --- | --- | --- | --- |
| 1 | ✅ **Auto-approve + negotiate** | Research Agent | "Buy premium sector research data": seller quotes $0.02, agent counters $0.01, settles instantly |
| 2 | ⚡ **Instant micro-pay** | Procurement Agent | "Order office supplies": $0.01, under the limit, no approval needed |
| 3 | 🙋 **Human approval** | Cloud Ops Agent | "Pay AWS invoice": negotiates to $0.08, exceeds the $0.05 auto-approve limit, approve in UI |
| 4 | 🔎 **Seller screened, passes** | Any flow above | The feed shows a "Seller risk check" step with the seller's payment history on Monad before payment |
| 5 | 🆕 **Unknown seller needs a human** | Research Agent | "Buy a sales leads contact list": FreshLeads' wallet has no payment history, so the $0.01 payment waits in Approvals with "Why this needs approval" |

Flows 4 and 5 need `ALCHEMY_API_KEY`. The FreshLeads seller is added by `npm run db:seed`.

<details>
<summary><b>🤖 Optional: Hermes background runtime</b></summary>

AgntPymt provisions one **Hermes profile per agent** under `~/.hermes/profiles/{orgId}__{agentId}/` with `SOUL.md`, `config.yaml` (including the `agntpymt` MCP server), and `skills/`. Manage identity and capabilities from **Agents → Identity / Capabilities** in the UI.

### Local setup

```bash
pip install hermes-agent
hermes setup
# Enable API in ~/.hermes/.env:
#   API_SERVER_ENABLED=true
npm run dev:all   # client + server + hermes gateway (:8642)
```

On Windows, Hermes 0.17.0 can crash with `ModuleNotFoundError: cron.scheduler_provider` (package name collision). `dev:all` uses `scripts/hermes-gateway.py` to work around this automatically.

If the gateway starts but AgntPymt still shows Hermes offline, confirm `API_SERVER_ENABLED=true` in `~/.hermes/.env` and restart `npm run dev:all`.

When the Hermes gateway is online, **Run** in the Agent Console delegates to Hermes with the agent's SOUL as `instructions` and streams lifecycle events into the chat feed. Purchases go through the `agntpymt` MCP tool (`AGENT_ID` is set per profile in `config.yaml`).

### Single-gateway limitation

One `hermes gateway` process uses **one** `HERMES_HOME` at startup. All agent profile **files** are created on disk, but skills/MCP from inactive profiles are not loaded until that profile is the gateway's home. For local MVP:

- SOUL is passed via `instructions` on each `/v1/runs` call (works across profiles).
- The shared `agntpymt` MCP entry uses per-profile `AGENT_ID` in env when Hermes loads that profile's `config.yaml`.

For full per-agent runtime isolation later: one gateway per org, subprocess per run with `HERMES_HOME=profile_path`, or Hermes per-run profile APIs.

See `docs/hermes-mcp.example.json` for a manual MCP reference (AgntPymt auto-writes this into each agent profile).

</details>

## 🗺️ Roadmap

- [x] Self-hosted gateway with auto-approve, 24h caps, org ceiling, kill switch and human approvals
- [x] MCP server so any MCP-capable agent can pay through the gateway
- [x] x402 USDC settlement and ERC-8004 identity and reputation on Monad testnet (also Arbitrum and Base Sepolia)
- [x] Optional on-chain audit anchor (`AgentSpendPolicy`, 16 Hardhat tests), on Monad testnet; verified on Arbitrum Sepolia and Robinhood Chain testnet
- [x] Seller risk screening before every payment (Alchemy on-chain history; Nansen labels optional)
- [ ] One-prompt onboarding: paste a prompt into your agent and it connects itself to AgntPymt
- [ ] Vendor allowlists, tool allowlists, and payment-count limits per day, week and month
- [ ] Invoice capture, entered by a human or generated by the agent
- [ ] Enterprise key management (cloud KMS, HSM or MPC) in place of keys in environment files
- [ ] More stablecoin rails: additional EVM chains and XRPL
- [ ] Merchant side: let sellers accept governed agent payments

## 🧱 Built with

- **[Monad](https://monad.xyz)**: USDC settlement over x402 through Monad's facilitator, ERC-8004 identity and reputation, and the `AgentSpendPolicy` audit anchor, all on Monad testnet.
- **[Alchemy](https://alchemy.com)**: Monad RPC for the gateway and contracts, and the Transfers API for a seller's payment history, so brand-new wallets are sent to a human.
- **[Nansen](https://nansen.ai)** (optional, `NANSEN_ENABLED=true`): wallet labels for every seller. A flagged label (exploiter, scam, sanctioned) denies the payment; a known entity lets it through under normal limits.

---

<div align="center">

**Your agents are moving fast. Your controls should too.**

Started at the Arbitrum Open House Singapore Buildathon. Submitted to Colosseum's Crypto World's Fair. Ported to Monad for the Metropolis hackathon.

</div>
