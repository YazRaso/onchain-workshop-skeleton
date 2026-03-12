/**
 * WORKSHOP STEP 2 — Give the Agent a Wallet
 *
 * Run this file to ask the agent for its wallet address and balance.
 * Copy the address, then fund it at https://sepoliafaucet.com
 *
 * Usage:
 *   npm run wallet
 */

import "dotenv/config";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getTools } from "./agent.js";

const tools = await getTools();

// TODO: call generateText() asking for the agent's wallet address and balance
// Hint: const { text } = await generateText({ model: google("gemini-2.5-flash"), tools, maxSteps: 10, prompt: "..." })
const { text } = await generateText({
  model: google("gemini-2.5-flash"),
  system: "You are an onchain AI agent. You have tools to interact with the blockchain. Always use your tools to answer questions — never say you can't check balances or interact onchain.",
  tools,
  maxSteps: 3,
  providerOptions: { google: { thinkingConfig: { thinkingBudget: 1024 } } },
  prompt:
    "What is your wallet address and current SOL balance on Solana devnet?",
});

console.log("Agent:", text);
console.log("\n─────────────────────────────────────────────────");
console.log("📋 Copy your agent's address above.");
console.log("💧 Get devnet SOL at: https://faucet.solana.com");
console.log("   Then run: npm run transactions");
