# Onchain Agent Starter
**Waterloo Blockchain Workshop — Build an Onchain AI Agent**

## Stack
| Layer | Tool |
|---|---|
| Agent SDK | Vercel AI SDK (`ai`, `@ai-sdk/openai`) |
| Onchain tools + wallet | Coinbase AgentKit (`@coinbase/agentkit-vercel-ai-sdk`) |
| Network | Ethereum Sepolia (testnet) |
| Payment protocol | x402 |

## Setup

### 1. Clone and install
```bash
git clone https://github.com/waterlooBlockchain/onchain-agent-starter
cd onchain-agent-starter
npm install
```

### 2. Set your API keys
```bash
cp .env.example .env
```
Fill in `.env`:
- **OPENAI_API_KEY** → platform.openai.com/api-keys
- **CDP_API_KEY_NAME** + **CDP_API_KEY_PRIVATE_KEY** → portal.cdp.coinbase.com/access/api

> ⚠️ Never commit your `.env` file.

## Workshop Steps

### Step 1 — Create the Agent (`src/agent.ts`)
Fill in your CDP credentials in `AgentKit.from()`, then call `getVercelAITools()`.

### Step 2 — Give it a Wallet
```bash
npm run wallet
```
Fill in the `generateText()` call. Copy the printed address and fund it at https://sepoliafaucet.com

### Step 3 — Test Transactions
```bash
npm run transactions
```
Fill in the three `generateText()` calls. Edit `RECIPIENT_ADDRESS` to send ETH to a classmate.

## Bonus — Interactive Mode
```bash
npm start
```

## The pattern
```ts
const { text } = await generateText({
  model: openai("gpt-4o"),
  tools,
  maxSteps: 10,
  prompt: "your prompt here",
});
console.log(text);
```

## Resources
- [AgentKit + Vercel AI SDK docs](https://docs.cdp.coinbase.com/agentkit/docs/vercel-ai-sdk)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [x402 Protocol](https://x402.org)
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
