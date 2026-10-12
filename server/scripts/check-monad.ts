/**
 * Read-only sanity check for the Monad testnet settlement setup (no keys needed):
 * facilitator support, USDC EIP-712 domain, ERC-8004 registries and the x402 price parser.
 *   npx tsx server/scripts/check-monad.ts
 */
import { createPublicClient, http } from "viem";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { env } from "../src/config.js";
import { SETTLEMENT_CHAIN, SETTLEMENT_RPC_URL, USDC_ADDRESS, X402_NETWORK } from "../src/chain/network.js";
import { ERC8004_IDENTITY_REGISTRY, ERC8004_REPUTATION_REGISTRY } from "../src/chain/erc8004/constants.js";

const client = createPublicClient({ chain: SETTLEMENT_CHAIN, transport: http(SETTLEMENT_RPC_URL) });

const eip712Abi = [
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "version", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
] as const;

async function main() {
  console.log(`Chain ${SETTLEMENT_CHAIN.name} (${X402_NETWORK}), RPC ${SETTLEMENT_RPC_URL}`);
  console.log(`Block: ${await client.getBlockNumber()}`);

  const [name, version] = await Promise.all([
    client.readContract({ address: USDC_ADDRESS, abi: eip712Abi, functionName: "name" }),
    client.readContract({ address: USDC_ADDRESS, abi: eip712Abi, functionName: "version" }),
  ]);
  console.log(`USDC ${USDC_ADDRESS}: name="${name}" version="${version}"`);

  for (const [label, address] of [
    ["Identity", ERC8004_IDENTITY_REGISTRY],
    ["Reputation", ERC8004_REPUTATION_REGISTRY],
  ] as const) {
    const code = await client.getCode({ address });
    console.log(`ERC-8004 ${label} ${address}: ${code && code !== "0x" ? "deployed" : "MISSING"}`);
  }

  const supported = await new HTTPFacilitatorClient({ url: env.facilitatorUrl }).getSupported();
  const kinds = supported.kinds.filter((k) => k.network === X402_NETWORK);
  console.log(
    `Facilitator ${env.facilitatorUrl}: ${kinds.length ? kinds.map((k) => `${k.scheme} v${k.x402Version}`).join(", ") : "does NOT support " + X402_NETWORK}`
  );

  const scheme = new ExactEvmScheme();
  scheme.registerMoneyParser(async (amount, network) =>
    network === X402_NETWORK
      ? { amount: String(Math.floor(amount * 1_000_000)), asset: USDC_ADDRESS, extra: { name: "USDC", version: "2" } }
      : null
  );
  console.log("Parsed $0.01:", JSON.stringify(await scheme.parsePrice("$0.01", X402_NETWORK)));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
