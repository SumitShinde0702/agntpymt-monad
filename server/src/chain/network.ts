import "../config.js";
import { defineChain, fallback, http, type Chain, type Transport } from "viem";
import { arbitrumSepolia, baseSepolia, monadTestnet } from "viem/chains";

export type SettlementChainKey = "monadTestnet" | "arbitrumSepolia" | "baseSepolia";

interface SettlementChainConfig {
  chain: Chain;
  name: string;
  usdc: `0x${string}`;
  explorerUrl: string;
  rpcUrl: string;
  faucetHint: string;
  gasSymbol: string;
  /** Minimum native balance an agent wallet needs before sending a tx. */
  minGas: number;
}

const alchemyApiKey = process.env.ALCHEMY_API_KEY?.trim() ?? "";

/** Alchemy Monad testnet endpoint (JSON-RPC plus alchemy_* enhanced methods); empty without a key. */
export const ALCHEMY_MONAD_TESTNET_URL = alchemyApiKey
  ? `https://monad-testnet.g.alchemy.com/v2/${alchemyApiKey}`
  : "";

/** EVM settlement chains: x402 USDC, ERC-8004 identity/reputation, AgentSpendPolicy. */
export const SETTLEMENT_CHAINS: Record<SettlementChainKey, SettlementChainConfig> = {
  monadTestnet: {
    chain: monadTestnet,
    name: "Monad Testnet",
    usdc: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
    explorerUrl: "https://testnet.monadexplorer.com",
    rpcUrl:
      process.env.MONAD_TESTNET_RPC_URL || ALCHEMY_MONAD_TESTNET_URL || "https://testnet-rpc.monad.xyz",
    faucetHint: "https://faucet.monad.xyz",
    gasSymbol: "MON",
    minGas: 0.05,
  },
  arbitrumSepolia: {
    chain: arbitrumSepolia,
    name: "Arbitrum Sepolia",
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    explorerUrl: "https://sepolia.arbiscan.io",
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
    faucetHint: "https://www.alchemy.com/faucets/arbitrum-sepolia",
    gasSymbol: "ETH",
    minGas: 0.00005,
  },
  baseSepolia: {
    chain: baseSepolia,
    name: "Base Sepolia",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    explorerUrl: "https://sepolia.basescan.org",
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    faucetHint: "https://www.alchemy.com/faucets/base-sepolia",
    gasSymbol: "ETH",
    minGas: 0.00005,
  },
};

function resolveSettlementChainKey(): SettlementChainKey {
  const raw = process.env.SETTLEMENT_CHAIN?.trim() || "monadTestnet";
  if (raw in SETTLEMENT_CHAINS) return raw as SettlementChainKey;
  throw new Error(
    `Unknown SETTLEMENT_CHAIN "${raw}". Expected one of: ${Object.keys(SETTLEMENT_CHAINS).join(", ")}`
  );
}

export const SETTLEMENT_CHAIN_KEY = resolveSettlementChainKey();
const active = SETTLEMENT_CHAINS[SETTLEMENT_CHAIN_KEY];

export const SETTLEMENT_CHAIN = active.chain;
export const SETTLEMENT_CHAIN_NAME = active.name;
export const X402_NETWORK = `eip155:${active.chain.id}` as const;
export const USDC_ADDRESS = active.usdc;
export const EXPLORER_URL = active.explorerUrl;
export const SETTLEMENT_RPC_URL = active.rpcUrl;

/**
 * RPC transport for the settlement chain. When a custom RPC (e.g. Alchemy) is configured, the chain's
 * public RPC is kept as a fallback so a bad key or a provider outage doesn't stop payments.
 */
export function settlementTransport(timeout: number): Transport {
  const publicUrl = active.chain.rpcUrls.default.http[0];
  if (!publicUrl || publicUrl === SETTLEMENT_RPC_URL) return http(SETTLEMENT_RPC_URL, { timeout });
  return fallback([http(SETTLEMENT_RPC_URL, { timeout }), http(publicUrl, { timeout })]);
}
export const SETTLEMENT_FAUCET_URL = active.faucetHint;
export const SETTLEMENT_GAS_SYMBOL = active.gasSymbol;
export const SETTLEMENT_MIN_GAS = active.minGas;

export const robinhoodChainTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.ROBINHOOD_TESTNET_RPC_URL || "https://rpc.testnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Robinhood Explorer", url: "https://explorer.testnet.chain.robinhood.com" },
  },
  testnet: true,
});

export function txExplorerUrl(txHash: string): string {
  return `${EXPLORER_URL}/tx/${txHash}`;
}
