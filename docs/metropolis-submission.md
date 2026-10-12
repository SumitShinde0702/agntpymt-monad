# Metropolis submission — Monad hackathon

Copy-paste source for the submission form.

## Project name
AgntPymt

## Track
Trust, Identity & AI Infrastructure

## One-liner
Governed payments for AI agents: spending limits, human approvals and kill switches enforced on Monad, settled in USDC over x402, with ERC-8004 identity and reputation.

## Links
- Repo: TODO
- AgentSpendPolicy (Monad testnet): https://testnet.monadexplorer.com/address/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c (source: https://repo.sourcify.dev/10143/0x542A4322762b255f8bA53F6A236B6191c8Cd0e1c)
- Demo video: TODO
- Website: https://agntpymt.com

## Problem
AI agents can now buy things on their own: APIs, data, SaaS, invoices. But no finance team will give an LLM a funded wallet without the controls they apply to employees: limits, approvals, a kill switch and an audit trail. Today teams either block agent payments entirely or hard-code private keys with no controls. Off-chain rules alone aren't enough, because whoever runs the server can bypass them.

## Solution
AgntPymt is a control plane for agent spending:
1. Each agent gets its own wallet, funded from a company treasury, and an **ERC-8004** identity on Monad.
2. Agents (Hermes, or any MCP client) discover sellers, negotiate a price and request payment.
3. Every spend goes through **AgentSpendPolicy** on Monad. Small amounts are auto-authorized; anything above the threshold waits for a human to approve on-chain. Per-agent and org-wide kill switches stop spending instantly.
4. Payment settles in USDC via **x402** on Monad through Monad's facilitator, and the settlement tx is recorded against the on-chain request.
5. The buyer agent rates the seller on the **ERC-8004** reputation registry, which builds verifiable trust between agents.

## Why Monad
- **Agent commerce is thousands of $0.01 payments.** A policy check, an approval and a settlement record per payment only make sense with cheap, predictable gas. On Monad, governance doesn't wipe out the margin.
- **Sub-second finality keeps agents fast.** The on-chain policy check sits in the payment path; with fast blocks the agent isn't left waiting for authorization.
- **The agent primitives are native.** Monad runs its own x402 facilitator and hosts the ERC-8004 registries, so identity, policy, settlement and reputation all live on one chain and the whole audit trail is on the Monad explorer.
- **Full EVM compatibility.** The same Solidity contract, viem client and x402 SDK run unchanged.

## Built during Metropolis
AgntPymt's gateway and contract were started at an earlier buildathon on Arbitrum. During Metropolis:
- Made Monad testnet (`eip155:10143`) the default settlement chain across server, client and contracts.
- Moved x402 settlement to Monad's facilitator (x402 v2) and upgraded the x402 SDK, with a custom asset parser for Monad testnet USDC (EIP-712 domain `USDC` / `2`).
- Deployed and verified `AgentSpendPolicy` on Monad testnet; agent binding, limits, approvals, kill switches and settlement records now land on Monad.
- ERC-8004 agent and seller registration plus post-payment ratings on Monad's registries.
- Chain-aware gas handling (MON thresholds, funding defaults and labels) and Monad explorer links throughout the Agent Console, Payments and Wallets pages.
- TODO: list sponsor integrations as they land (Privy, Qwen/Kimi, Nansen, Dynamic, Envio, Alchemy).

## Technical highlights
- `AgentSpendPolicy.sol`: binding needs an EIP-712 signature from the agent (no address squatting; ERC-1271 compatible). Enforces `auto ≤ perTx ≤ daily`. Approvals expire after 3 days. Settlement is either recorded from x402 or executed on-chain via `SafeERC20.transferFrom` behind `ReentrancyGuard`. Uses custom errors throughout.
- 16 Hardhat tests cover binding, limits, daily rollover, approvals and expiry, kill switches, settlement and cancellation.
- Server integration (viem) serializes admin writes to avoid nonce collisions and maps contract reverts to policy denials. RPC outages fall back to the off-chain policy with an audit entry.
- Every on-chain step streams into the Agent Console with a Monad explorer link. The Payments page shows payment, rating and policy txs for each settlement.

## Roadmap
- **Month 1:** Monad mainnet deploy (USDC `0x754704Bc059F8C67012fEd69BC8A327a5aafb603`); per-org admin keys (Safe multisig as policy admin); vendor allowlists on-chain.
- **Month 2:** Approvals signed by the treasury wallet in the UI; seller risk scoring before payment.
- **Month 3:** Pilot with 3 teams running agent procurement; SDK so any agent framework can call `requestSpend` via MCP.

## Team
Sumit Shinde — TODO: one-line background + X/LinkedIn

---

## 2-minute demo video script
1. **(0:00) Hook.** "AI agents can now spend money. AgntPymt makes that safe, with policy enforced on Monad."
2. **(0:15) Policies page.** Show the Research Agent: $0.05 auto-approve, daily cap, kill switch.
3. **(0:30) Agent Console, auto-approve.** Research Agent: "Buy premium sector research data". The seller quotes $0.02 and the agent counters $0.01. The feed shows "Authorized on Monad Testnet", then "Payment sent", then "Settlement recorded on Monad Testnet". Click the Monad explorer link.
4. **(1:00) Human approval.** Cloud Ops: "Pay AWS invoice" at $0.08. The feed shows "On-chain approval required". Approve in the UI, then show "Approved on Monad Testnet" and the settlement. Show the `SpendApproved` event on the Monad explorer.
5. **(1:30) Kill switch.** Pause the org and run again. "Denied by policy" appears.
6. **(1:45) Payments page.** Payment, rating and policy txs per row. Close: "Policy, payment and reputation, all on Monad."
