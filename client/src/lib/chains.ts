import type { Chain } from "viem";
import { arbitrumSepolia, baseSepolia, monadTestnet } from "viem/chains";

type SettlementChainKey = "monadTestnet" | "arbitrumSepolia" | "baseSepolia";

interface SettlementChainConfig {
  chain: Chain;
  name: string;
  usdc: `0x${string}`;
  explorerUrl: string;
  explorerName: string;
  ethFaucetUrl: string;
  /** Agent wallets below this native balance are flagged as needing gas. */
  minGas: number;
  defaultGasFund: string;
}

/** Keep in sync with server/src/chain/network.ts. */
const SETTLEMENT_CHAINS: Record<SettlementChainKey, SettlementChainConfig> = {
  monadTestnet: {
    chain: monadTestnet,
    name: "Monad Testnet",
    usdc: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
    explorerUrl: "https://testnet.monadexplorer.com",
    explorerName: "Monad Explorer",
    ethFaucetUrl: "https://faucet.monad.xyz",
    minGas: 0.05,
    defaultGasFund: "0.2",
  },
  arbitrumSepolia: {
    chain: arbitrumSepolia,
    name: "Arbitrum Sepolia",
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    explorerUrl: "https://sepolia.arbiscan.io",
    explorerName: "Arbiscan",
    ethFaucetUrl: "https://www.alchemy.com/faucets/arbitrum-sepolia",
    minGas: 0.00005,
    defaultGasFund: "0.001",
  },
  baseSepolia: {
    chain: baseSepolia,
    name: "Base Sepolia",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    explorerUrl: "https://sepolia.basescan.org",
    explorerName: "Basescan",
    ethFaucetUrl: "https://www.alchemy.com/faucets/base-sepolia",
    minGas: 0.00005,
    defaultGasFund: "0.001",
  },
};

const key = (import.meta.env.SETTLEMENT_CHAIN?.trim() || "monadTestnet") as SettlementChainKey;

export const ACTIVE_CHAIN_KEY: SettlementChainKey = key in SETTLEMENT_CHAINS ? key : "monadTestnet";
export const ACTIVE_CHAIN = SETTLEMENT_CHAINS[ACTIVE_CHAIN_KEY];

export type DisplayChainKey = SettlementChainKey | "solanaDevnet";

export interface DisplayChain {
  key: DisplayChainKey;
  name: string;
  family: "EVM" | "SVM";
  gasToken: string;
  gasFaucetUrl: string;
  usdcLabel: string;
}

export const DISPLAY_CHAINS: DisplayChain[] = [
  {
    key: "monadTestnet",
    name: "Monad Testnet",
    family: "EVM",
    gasToken: "MON",
    gasFaucetUrl: SETTLEMENT_CHAINS.monadTestnet.ethFaucetUrl,
    usdcLabel: "USDC (ERC-20)",
  },
  {
    key: "arbitrumSepolia",
    name: "Arbitrum Sepolia",
    family: "EVM",
    gasToken: "ETH",
    gasFaucetUrl: SETTLEMENT_CHAINS.arbitrumSepolia.ethFaucetUrl,
    usdcLabel: "USDC (ERC-20)",
  },
  {
    key: "baseSepolia",
    name: "Base Sepolia",
    family: "EVM",
    gasToken: "ETH",
    gasFaucetUrl: SETTLEMENT_CHAINS.baseSepolia.ethFaucetUrl,
    usdcLabel: "USDC (ERC-20)",
  },
  {
    key: "solanaDevnet",
    name: "Solana Devnet",
    family: "SVM",
    gasToken: "SOL",
    gasFaucetUrl: "https://faucet.solana.com/",
    usdcLabel: "USDC (SPL)",
  },
];

const DISPLAY_CHAIN_STORAGE_KEY = "agntpymt.displayChain";

function readDisplayChainKey(): DisplayChainKey {
  try {
    const stored = localStorage.getItem(DISPLAY_CHAIN_STORAGE_KEY);
    const match = DISPLAY_CHAINS.find((c) => c.key === stored);
    // An EVM label must match the settlement chain, or gas labels disagree with the real balances.
    if (match && (match.family !== "EVM" || match.key === ACTIVE_CHAIN_KEY)) return match.key;
  } catch {
    /* storage unavailable */
  }
  return ACTIVE_CHAIN_KEY;
}

/**
 * Chain shown in labels across the app. Selected in Settings and stored per browser; it does not
 * change where payments settle (that is ACTIVE_CHAIN, from SETTLEMENT_CHAIN at build time).
 */
export const DISPLAY_CHAIN: DisplayChain =
  DISPLAY_CHAINS.find((c) => c.key === readDisplayChainKey()) ?? DISPLAY_CHAINS[0];

export function setDisplayChain(next: DisplayChainKey) {
  try {
    localStorage.setItem(DISPLAY_CHAIN_STORAGE_KEY, next);
  } catch {
    /* storage unavailable */
  }
  window.location.reload();
}
