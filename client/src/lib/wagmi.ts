import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ACTIVE_CHAIN } from "./chains";

export const USDC_ADDRESS = ACTIVE_CHAIN.usdc;

export const wagmiConfig = getDefaultConfig({
  appName: import.meta.env.VITE_APP_NAME ?? "AgntPymt",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "00000000000000000000000000000000",
  chains: [ACTIVE_CHAIN.chain],
  ssr: false,
});

export const TARGET_CHAIN = ACTIVE_CHAIN.chain;
export const TARGET_CHAIN_NAME = ACTIVE_CHAIN.name;
