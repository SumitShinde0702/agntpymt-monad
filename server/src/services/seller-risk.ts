import { env } from "../config.js";
import { ALCHEMY_MONAD_TESTNET_URL } from "../chain/network.js";

export type SellerRiskTier = "low" | "medium" | "high" | "blocked" | "unchecked";

export interface NansenLabel {
  label: string;
  category?: string | null;
  kind?: string[];
}

export interface SellerRiskAssessment {
  address: string;
  tier: SellerRiskTier;
  labels: NansenLabel[];
  /** Inbound transfers seen on Monad (capped at ALCHEMY_MAX_TRANSFERS); null when Alchemy was unavailable. */
  inboundTransfers: number | null;
  firstSeenBlock: number | null;
  /** Labels that triggered a block. */
  flaggedLabels: string[];
  summary: string;
  sources: { nansen: "ok" | "unavailable" | "disabled"; alchemy: "ok" | "unavailable" };
  checkedAt: string;
}

const NANSEN_LABELS_URL = "https://api.nansen.ai/api/v1/profiler/address/labels";
const FLAGGED_LABEL = /exploit|hack|scam|phish|sanction|ofac|tornado|mixer|drainer|lazarus/i;
const KNOWN_ENTITY_CATEGORIES = new Set(["cefi", "defi"]);
const MIN_INBOUND_TRANSFERS = 3;
const ALCHEMY_MAX_TRANSFERS = 20;
const REQUEST_TIMEOUT_MS = 5_000;
/** Transfers lookups scan from block 0, which can be slow on Monad. */
const ALCHEMY_TIMEOUT_MS = 12_000;
const CACHE_TTL_MS = 60 * 60 * 1000;

const cache = new Map<string, { at: number; value: SellerRiskAssessment }>();

function nansenEnabled() {
  return env.nansenEnabled && Boolean(env.nansenApiKey);
}

export async function fetchNansenLabels(address: string): Promise<NansenLabel[] | null> {
  if (!nansenEnabled()) return null;
  try {
    const res = await fetch(NANSEN_LABELS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: env.nansenApiKey },
      // Seller wallets are testnet addresses; "all" finds labels the same address carries on mainnets.
      body: JSON.stringify({ address, chain: "all" }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[seller-risk] Nansen labels ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return null;
    }
    const body = (await res.json()) as { data?: NansenLabel[] };
    return (body.data ?? []).filter((l) => typeof l?.label === "string");
  } catch (err) {
    console.warn(`[seller-risk] Nansen labels failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

export async function fetchAlchemyHistory(
  address: string
): Promise<{ inboundTransfers: number; firstSeenBlock: number | null } | null> {
  if (!ALCHEMY_MONAD_TESTNET_URL) return null;
  try {
    const res = await fetch(ALCHEMY_MONAD_TESTNET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            toAddress: address,
            category: ["external", "erc20"],
            order: "asc",
            excludeZeroValue: true,
            maxCount: `0x${ALCHEMY_MAX_TRANSFERS.toString(16)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(ALCHEMY_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[seller-risk] Alchemy transfers ${res.status}`);
      return null;
    }
    const body = (await res.json()) as {
      result?: { transfers?: { blockNum?: string }[] };
      error?: { message?: string };
    };
    if (body.error || !body.result) {
      console.warn(`[seller-risk] Alchemy transfers error: ${body.error?.message ?? "no result"}`);
      return null;
    }
    const transfers = body.result.transfers ?? [];
    const first = transfers[0]?.blockNum;
    return {
      inboundTransfers: transfers.length,
      firstSeenBlock: first ? Number.parseInt(first, 16) : null,
    };
  } catch (err) {
    console.warn(`[seller-risk] Alchemy transfers failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function describeHistory(inbound: number | null) {
  if (inbound == null) return "on-chain history unavailable";
  if (inbound >= ALCHEMY_MAX_TRANSFERS) return `${ALCHEMY_MAX_TRANSFERS}+ prior payments on Monad`;
  return `${inbound} prior payment${inbound === 1 ? "" : "s"} on Monad`;
}

function classify(
  labels: NansenLabel[] | null,
  history: { inboundTransfers: number } | null
): { tier: SellerRiskTier; flagged: string[]; reason: string } {
  const inbound = history?.inboundTransfers ?? null;
  if (labels == null) {
    // No Nansen labels (disabled or failed): decide on Alchemy payment history alone.
    if (inbound == null) {
      return { tier: "unchecked", flagged: [], reason: "risk check unavailable (no on-chain history)" };
    }
    if (inbound < MIN_INBOUND_TRANSFERS) {
      return { tier: "high", flagged: [], reason: `brand-new wallet, ${describeHistory(inbound)}` };
    }
    return { tier: "low", flagged: [], reason: `established wallet, ${describeHistory(inbound)}` };
  }

  const flagged = labels.filter((l) => FLAGGED_LABEL.test(l.label)).map((l) => l.label);
  if (flagged.length > 0) {
    return { tier: "blocked", flagged, reason: `flagged by Nansen: ${flagged.join(", ")}` };
  }

  const known = labels.filter(
    (l) =>
      KNOWN_ENTITY_CATEGORIES.has((l.category ?? "").toLowerCase()) ||
      (l.kind ?? []).some((k) => k.toLowerCase().includes("entity"))
  );
  if (known.length > 0) {
    return {
      tier: "low",
      flagged: [],
      reason: `known entity (${known.map((l) => l.label).slice(0, 3).join(", ")}), ${describeHistory(inbound)}`,
    };
  }

  if (labels.length === 0 && inbound != null && inbound < MIN_INBOUND_TRANSFERS) {
    return { tier: "high", flagged: [], reason: `no Nansen labels, ${describeHistory(inbound)}` };
  }

  const labelText =
    labels.length === 0 ? "no Nansen labels" : `Nansen labels: ${labels.map((l) => l.label).slice(0, 3).join(", ")}`;
  return { tier: "medium", flagged: [], reason: `${labelText}, ${describeHistory(inbound)}` };
}

/** Screen a seller wallet before paying it. Never throws; with no data at all the tier is "unchecked". */
export async function assessSellerRisk(address: string): Promise<SellerRiskAssessment> {
  const key = address.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const [labels, history] = await Promise.all([fetchNansenLabels(address), fetchAlchemyHistory(address)]);
  const classified = classify(labels, history);
  // The org's own configured payout wallet is trusted unless Nansen flags it.
  const orgPayout = Boolean(env.evmPayToAddress) && key === env.evmPayToAddress.toLowerCase();
  const { tier, flagged, reason } =
    orgPayout && classified.tier !== "blocked"
      ? {
          tier: "low" as const,
          flagged: [],
          reason: `org-configured payout wallet (EVM_PAY_TO_ADDRESS), ${describeHistory(history?.inboundTransfers ?? null)}`,
        }
      : classified;

  const value: SellerRiskAssessment = {
    address,
    tier,
    labels: labels ?? [],
    inboundTransfers: history?.inboundTransfers ?? null,
    firstSeenBlock: history?.firstSeenBlock ?? null,
    flaggedLabels: flagged,
    summary: `Seller ${shortAddress(address)} risk ${tier.toUpperCase()}: ${reason}`,
    sources: {
      nansen: labels ? "ok" : nansenEnabled() ? "unavailable" : "disabled",
      alchemy: history ? "ok" : "unavailable",
    },
    checkedAt: new Date().toISOString(),
  };

  if (labels) cache.set(key, { at: Date.now(), value });
  return value;
}
