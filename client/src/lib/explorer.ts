import { ACTIVE_CHAIN } from "./chains";

export const EXPLORER_URL = ACTIVE_CHAIN.explorerUrl;
export const EXPLORER_NAME = ACTIVE_CHAIN.explorerName;

export function txExplorerUrl(txHash: string) {
  return `${EXPLORER_URL}/tx/${txHash}`;
}

export function addressExplorerUrl(address: string) {
  return `${EXPLORER_URL}/address/${address}`;
}
