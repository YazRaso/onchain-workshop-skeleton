/**
 * WORKSHOP STEP 3 — Test Transactions
 *
 * Sends ETH, checks balance, and triggers an x402 payment.
 *
 * ⚠️  Fund your agent's wallet first!
 *     Run `npm run wallet`, copy the address, get testnet ETH at https://sepoliafaucet.com
 *
 * Usage:
 *   npm run transactions
 */

import "dotenv/config";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getTools, getWalletProvider } from "./agent.js";

// Replace with a classmate's agent address to send them SOL!
const RECIPIENT_ADDRESS = "3oN5gwmGHNxWAYRRwfvuk7g4WQAqAPgQzHdHVqwa54Ld";

// A real x402-enabled endpoint — the agent pays and fetches automatically
const X402_ENDPOINT = "http://localhost:3402/weather";

console.log("⏳ Initializing wallet...");
const walletProvider = await getWalletProvider();
console.log("⏳ Building AgentKit instances...");
const [tools, allX402Tools] = await Promise.all([
  getTools({ walletProvider }),
  getTools({ walletProvider, includeX402: true }),
]);
// Gemini rejects integer enum values in discover_x402_services schema — drop it
const {
  X402ActionProvider_discover_x402_services: _dropped,
  ...toolsWithX402
} = allX402Tools as any;
console.log("✅ Ready.\n");

// ── Transaction 1: Check balance ──────────────────────────────────────────────
console.log("━━━ TXN 1: Check Balance ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// TODO: call generateText() asking for the agent's current ETH balance
console.log("⏳ Asking agent for balance...");
const t1 = Date.now();
const { text: balance, steps: steps1 } = await generateText({
  model: google("gemini-2.5-flash"),
  system:
    "You are an onchain AI agent. You have tools to interact with the blockchain. Always use your tools to answer questions — never say you can't check balances or interact onchain.",
  tools,
  maxSteps: 3,
  providerOptions: { google: { thinkingConfig: { thinkingBudget: 1024 } } },
  prompt: "What is your current SOL balance on Solana devnet?",
});

console.log(`⏱  Done in ${((Date.now() - t1) / 1000).toFixed(1)}s`);
if (balance) {
  console.log("Agent:", balance, "\n");
} else {
  // Model called the tool but didn't emit final text — print the tool result directly
  const toolResults = steps1.flatMap(
    (s) => (s as any).toolResults ?? [],
  ) as any[];
  toolResults.forEach((r) =>
    console.log("Result:", JSON.stringify(r.result, null, 2)),
  );
  console.log();
}

// ── Transaction 2: Send ETH ───────────────────────────────────────────────────
console.log("━━━ TXN 2: Send ETH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// TODO: call generateText() to send 0.0001 ETH to RECIPIENT_ADDRESS
console.log("⏳ Asking agent to send SOL...");
const t2 = Date.now();
const { text: sent, steps: steps2 } = await generateText({
  model: google("gemini-2.5-flash"),
  system:
    "You are an onchain AI agent. You have tools to interact with the blockchain. Always use your tools to answer questions — never say you can't check balances or interact onchain.",
  tools,
  maxSteps: 3,
  providerOptions: { google: { thinkingConfig: { thinkingBudget: 1024 } } },
  prompt: `Send 0.001 SOL to ${RECIPIENT_ADDRESS} on Solana devnet.`,
});

console.log(`⏱  Done in ${((Date.now() - t2) / 1000).toFixed(1)}s`);
if (sent) {
  console.log("Agent:", sent, "\n");
} else {
  const toolResults = steps2.flatMap(
    (s) => (s as any).toolResults ?? [],
  ) as any[];
  toolResults.forEach((r) =>
    console.log("Result:", JSON.stringify(r.result, null, 2)),
  );
  console.log();
}
console.log(
  "🔍 Verify on Solana Explorer: https://explorer.solana.com/?cluster=devnet\n",
);

// ── Transaction 3: x402 payment ───────────────────────────────────────────────
console.log("━━━ TXN 3: x402 Payment ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("📡 Hitting x402 endpoint:", X402_ENDPOINT);
console.log(
  "   The agent will receive a 402, pay automatically, then fetch the data.\n",
);

// TODO: call generateText() to fetch X402_ENDPOINT — tell the agent to pay if it gets a 402
console.log("⏳ Asking agent to fetch x402 endpoint...");
const t3 = Date.now();
const { text: x402 } = await generateText({
  model: google("gemini-2.5-flash"),
  system:
    "You are an onchain AI agent. You have tools to interact with the blockchain and make HTTP requests. Always use your tools — never say you can't fetch URLs or make payments.",
  tools: toolsWithX402,
  maxSteps: 5,
  providerOptions: { google: { thinkingConfig: { thinkingBudget: 1024 } } },
  prompt: `Fetch the URL ${X402_ENDPOINT}. If you receive a 402 Payment Required response, pay the requested amount automatically and retry to get the data.`,
});

console.log(`⏱  Done in ${((Date.now() - t3) / 1000).toFixed(1)}s`);
console.log("Agent:", x402, "\n");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(
  "✅ All done! Your agent just made autonomous onchain transactions.",
);
