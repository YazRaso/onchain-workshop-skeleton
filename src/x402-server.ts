/**
 * Local x402 demo server — run alongside transactions.ts
 * Usage: npx tsx src/x402-server.ts
 *
 * Returns a real 402 Payment Required response on GET /weather.
 * The agent's x402 tools will read it, pay, and retry.
 */

import { createServer, IncomingMessage, ServerResponse } from "http";

const PORT = 3402;

// USDC devnet mint
const USDC_DEVNET_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
// Agent's Solana wallet address (feePayer = tx fee payer = the signer)
const AGENT_ADDRESS = "3oN5gwmGHNxWAYRRwfvuk7g4WQAqAPgQzHdHVqwa54Ld";

// x402-compliant payment requirements (v1 format — body must have x402Version + accepts)
const PAYMENT_REQUIREMENTS = [
  {
    scheme: "exact",
    network: "solana-devnet",
    maxAmountRequired: "1000", // 0.001 USDC (6 decimals)
    resource: `http://localhost:${PORT}/weather`,
    description: "Pay 0.001 USDC to get the weather report",
    mimeType: "application/json",
    payTo: AGENT_ADDRESS, // recipient of USDC (self-payment for demo)
    maxTimeoutSeconds: 60,
    asset: USDC_DEVNET_MINT,
    extra: { feePayer: AGENT_ADDRESS }, // required by SVM payment builder
  },
];

function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.url !== "/weather") {
    res.writeHead(404).end("Not found");
    return;
  }

  const xPayment = req.headers["x-payment"];

  if (!xPayment) {
    // No payment header — return 402 with x402-compliant body + base64-encoded header
    const body = JSON.stringify({
      x402Version: 1,
      accepts: PAYMENT_REQUIREMENTS,
    });
    const headerValue = Buffer.from(body).toString("base64");
    res.writeHead(402, {
      "Content-Type": "application/json",
      "payment-required": headerValue, // base64-encoded; x402-fetch reads this header
    });
    res.end(body);
    console.log("→ 402 sent (no payment header)");
    return;
  }

  // Payment header present — return weather data
  console.log("→ Payment received, serving response");
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      temperature: "72°F",
      condition: "Sunny",
      location: "Solana Devnet",
      message: "✅ x402 payment accepted! Here is your weather data.",
    }),
  );
}

const server = createServer(handler);
server.listen(PORT, () => {
  console.log(
    `🌐 x402 demo server running at http://localhost:${PORT}/weather`,
  );
  console.log(`   Hit Ctrl+C to stop.\n`);
});
