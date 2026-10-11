import "../config.js";
import { defineChain, type Chain } from "viem";
import { arbitrumSepolia, baseSepolia } from "viem/chains";

export type SettlementChainKey = "arbitrumSepolia" | "baseSepolia";

interface SettlementChainConfig {
  chain: Chain;
  name: string;
  usdc: `0x${string}`;
  explorerUrl: string;
  rpcUrl: string;
  faucetHint: string;
}

/** EVM settlement chains: x402 USDC, ERC-8004 identity/reputation, AgentSpendPolicy. */
export const SETTLEMENT_CHAINS: Record<SettlementChainKey, SettlementChainConfig> = {
  arbitrumSepolia: {
    chain: arbitrumSepolia,
    name: "Arbitrum Sepolia",
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    explorerUrl: "https://sepolia.arbiscan.io",
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
    faucetHint: "https://www.alchemy.com/faucets/arbitrum-sepolia",
  },
  baseSepolia: {
    chain: baseSepolia,
    name: "Base Sepolia",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    explorerUrl: "https://sepolia.basescan.org",
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
    faucetHint: "https://www.alchemy.com/faucets/base-sepolia",
  },
};

function resolveSettlementChainKey(): SettlementChainKey {
  const raw = process.env.SETTLEMENT_CHAIN?.trim() || "arbitrumSepolia";
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
export const SETTLEMENT_FAUCET_URL = active.faucetHint;

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
