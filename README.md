<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/Logo%20Dark.png">
    <source media="(prefers-color-scheme: light)" srcset="./public/Logo%20Light.png">
    <img alt="SmoothSend Logo" src="./public/Logo%20Light.png" width="400">
  </picture>

  <h1>SmoothSend Demo</h1>
  <p><strong>Gasless Transactions Made Simple</strong></p>

  <p>
    <a href="https://dashboard.smoothsend.xyz">Dashboard</a> •
    <a href="https://docs.smoothsend.xyz">Documentation</a> •
    <a href="https://github.com/SmoothSend/smoothsendapifrontend">GitHub</a> •
    <a href="https://discord.smoothsend.xyz">Discord</a> •
    <a href="https://x.com/smoothsend">Twitter</a> •
    <a href="https://smoothsend.xyz">Website</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Aptos-Mainnet-blue" alt="Aptos Mainnet">
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
    <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js">
  </p>
</div>

---

## 🚀 Overview

This demo application showcases how to integrate **SmoothSend's gasless transaction service** into your Aptos dApp. SmoothSend eliminates the need for users to hold APT for gas fees, enabling true gasless transactions on Aptos.

### Key Features

- ✅ **Zero Gas Fees** - Users don't need APT to transact
- ✅ **Multi-Network** - Supports both Testnet (FREE) and Mainnet ($0.01/tx)
- ✅ **Script Composer** - Complex batched transactions without custom contracts
- ✅ **Dynamic Fee Calculation** - Real-time gas cost estimation
- ✅ **Wallet Integration** - Works with Petra and other Aptos wallets

---

## 🏗️ Architecture

### Transaction Flow Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│  SmoothSend  │─────▶│   Aptos     │
│   (User)    │      │   Relayer    │      │  Blockchain │
└─────────────┘      └──────────────┘      └─────────────┘
      │                      │                      │
      │ 1. Build Request     │                      │
      │─────────────────────▶│                      │
      │                      │ 2. Calculate Fee     │
      │                      │ 3. Build Script      │
      │                      │    Composer Tx       │
      │ 4. Transaction Bytes │                      │
      │◀─────────────────────│                      │
      │ 5. Sign with Wallet  │                      │
      │ 6. Submit Signature  │                      │
      │─────────────────────▶│                      │
      │                      │ 7. Add Fee Payer     │
      │                      │ 8. Submit Tx         │
      │                      │─────────────────────▶│
      │                      │ 9. Confirmation      │
      │                      │◀─────────────────────│
      │ 10. Transaction Hash │                      │
      │◀─────────────────────│                      │
```

---

## 🔧 How It Works

### Network Support

The demo supports both **Testnet** and **Mainnet** with different transaction flows optimized for each:

#### **Testnet Flow** (Simple Transfer - FREE)
```typescript
// 1. Build transaction on frontend with fee payer flag
const rawTransaction = await aptos.transaction.build.simple({
  sender: account.address,
  withFeePayer: true, // Enables gasless
  data: {
    function: "0x1::primary_fungible_store::transfer",
    typeArguments: ["0x1::fungible_asset::Metadata"],
    functionArguments: [assetType, recipient, amount]
  }
})

// 2. Sign with wallet
const signResponse = await signTransaction({ 
  transactionOrPayload: rawTransaction 
})

// 3. Submit to relayer (Legacy Mode)
const result = await smoothSendClient.submitSignedTransaction(
  transactionBytes,
  authenticatorBytes
)
```

**Perfect for**: Development, testing, and prototyping without any costs.

---

#### **Mainnet Flow** (Script Composer - $0.01/tx)
```typescript
// 1. Request transaction build from backend
const buildResponse = await smoothSendClient.sendGaslessTransaction({
  sender,
  recipient,
  amount,
  assetType,
  network: 'mainnet',
  decimals,
  symbol
})

// Backend builds Script Composer transaction:
// - Withdraws amount from user
// - Withdraws fee from user
// - Deposits amount to recipient
// - Deposits fee to treasury

// 2. Deserialize transaction bytes
const transaction = SimpleTransaction.deserialize(
  new Deserializer(buildResponse.transactionBytes)
)

// 3. Sign with wallet
const signResponse = await signTransaction({ 
  transactionOrPayload: transaction 
})

// 4. Submit signed transaction
const result = await smoothSendClient.submitSignedTransaction(
  buildResponse.transactionBytes,
  authenticatorBytes
)
```

**Perfect for**: Production applications with real users and transactions.

---

## 🎯 Script Composer Deep Dive

### What is Script Composer?

Script Composer is Aptos's native SDK for building **batched transactions** without deploying custom Move contracts. It allows multiple operations to execute atomically in a single transaction.

### The Gasless Transaction Structure

For mainnet, SmoothSend uses Script Composer to create a complex transaction with 4 batched calls:

```typescript
// Pseudo-code of what happens on the backend
composer.addBatchedCalls([
  // Call 1: Withdraw recipient amount
  {
    function: '0x1::primary_fungible_store::withdraw',
    args: [userSigner, assetMetadata, amount]
  },
  
  // Call 2: Withdraw fee amount
  {
    function: '0x1::primary_fungible_store::withdraw',
    args: [userSigner, assetMetadata, fee]
  },
  
  // Call 3: Deposit to recipient
  {
    function: '0x1::primary_fungible_store::deposit',
    args: [recipientAddress, amountAsset]
  },
  
  // Call 4: Deposit fee to treasury
  {
    function: '0x1::primary_fungible_store::deposit',
    args: [treasuryAddress, feeAsset]
  }
])
```

### Why Script Composer?

1. **No Contract Deployment** - Uses standard Aptos framework functions
2. **Atomic Execution** - All operations succeed or fail together
3. **Fee Extraction** - Cleanly separates user amount from service fee
4. **Gas Efficiency** - Single transaction for multiple operations

### Transaction Anatomy

When you inspect a mainnet transaction, you'll see:

```json
{
  "events": [
    {
      "type": "0x1::fungible_asset::Withdraw",
      "data": { "amount": "1000000", "store": "0x..." }  // User amount
    },
    {
      "type": "0x1::fungible_asset::Withdraw",
      "data": { "amount": "5445", "store": "0x..." }     // Fee amount
    },
    {
      "type": "0x1::fungible_asset::Deposit",
      "data": { "amount": "1000000", "store": "0x..." }  // To recipient
    },
    {
      "type": "0x1::fungible_asset::Deposit",
      "data": { "amount": "5445", "store": "0x..." }     // To treasury
    }
  ]
}
```

---

## 💰 Fee Calculation

### Dynamic Pricing

SmoothSend calculates fees dynamically based on:

```typescript
fee = (gasUnits × gasPrice × aptPrice) + markup
```

- **Gas Units**: Estimated execution cost (~20-30 units)
- **Gas Price**: Current network gas price (100 octas/unit)
- **APT Price**: Real-time APT/USD price from CoinGecko
- **Markup**: Service fee (configurable per tier)

### Fee Tiers

| Tier | Monthly Limit | Fee Structure |
|------|--------------|---------------|
| Free | 100 tx | $0 (testnet only) |
| Starter | 1,000 tx | $0.01/tx |
| Pro | 10,000 tx | $0.008/tx |
| Enterprise | Unlimited | Custom pricing |

---

## 🛠️ Integration Guide

### 1. Installation

```bash
npm install @aptos-labs/ts-sdk @aptos-labs/wallet-adapter-react
```

### 2. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SMOOTHSEND_API_URL=https://proxy.smoothsend.xyz/api/v1/relayer
NEXT_PUBLIC_SMOOTHSEND_API_KEY=your_api_key_here
NEXT_PUBLIC_NETWORK=testnet
```

Get your API key at [dashboard.smoothsend.xyz](https://dashboard.smoothsend.xyz)

### 3. Initialize Client

```typescript
import { SmoothSendClient } from './lib/smoothsend'

const smoothSendClient = new SmoothSendClient({
  apiUrl: process.env.NEXT_PUBLIC_SMOOTHSEND_API_URL,
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY
})
```

### 4. Estimate Fee

```typescript
const estimate = await smoothSendClient.estimateFee({
  sender: userAddress,
  recipient: recipientAddress,
  amount: "1000000", // 1 USDC (6 decimals)
  assetType: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
  network: "mainnet",
  decimals: 6,
  symbol: "USDC"
})

console.log(`Fee: $${estimate.feeInUsd}`)
```

### 5. Execute Transaction

```typescript
// For Mainnet (Script Composer)
const buildResponse = await smoothSendClient.sendGaslessTransaction({
  sender: userAddress,
  recipient: recipientAddress,
  amount: "1000000",
  assetType: usdcAddress,
  network: "mainnet",
  decimals: 6,
  symbol: "USDC"
})

// Deserialize and sign
const transaction = SimpleTransaction.deserialize(
  new Deserializer(new Uint8Array(buildResponse.transactionBytes))
)

const signResponse = await signTransaction({ 
  transactionOrPayload: transaction 
})

// Submit
const result = await smoothSendClient.submitSignedTransaction(
  buildResponse.transactionBytes,
  Array.from(signResponse.authenticator.bcsToBytes())
)

console.log(`Transaction: ${result.txnHash}`)
```

---

## 📁 Project Structure

```
smoothsend-demo/
├── app/                    # Next.js app directory
├── components/            
│   ├── transfer-form.tsx  # Main transaction UI
│   ├── transfer-card.tsx  # Transaction display
│   └── wallet-connect.tsx # Wallet integration
├── lib/
│   ├── smoothsend.ts      # SmoothSend API client
│   ├── aptos-client.ts    # Aptos SDK utilities
│   └── config.ts          # Environment configuration
├── providers/
│   └── wallet-provider.tsx # Wallet adapter setup
└── public/
    ├── Logo Dark.png      # Dark mode logo
    └── Logo Light.png     # Light mode logo
```

---

## 🔑 Key Components

### SmoothSend Client (`lib/smoothsend.ts`)

Handles all API communication:
- `estimateFee()` - Get transaction cost estimate
- `sendGaslessTransaction()` - Build transaction (Script Composer)
- `submitSignedTransaction()` - Submit signed transaction (Legacy Mode)

### Transfer Form (`components/transfer-form.tsx`)

Main UI component that:
- Manages network switching (testnet/mainnet)
- Fetches token balances
- Estimates fees in real-time
- Handles transaction signing and submission
- Displays transaction results

### Wallet Provider (`providers/wallet-provider.tsx`)

Configures Aptos wallet adapter:
- Petra wallet integration
- Auto-connect functionality
- Error handling

---

## 🧪 Testing

### Testnet Testing

1. Get testnet APT from [faucet](https://aptoslabs.com/testnet-faucet)
2. Get testnet USDC from SmoothSend faucet
3. Connect wallet and switch to testnet
4. Send transactions (FREE)

### Mainnet Testing

1. Ensure you have mainnet USDC
2. Get API key from [dashboard.smoothsend.xyz](https://dashboard.smoothsend.xyz)
3. Switch to mainnet in the UI
4. Send transactions ($0.01 each)

---

## 🐛 Troubleshooting

### "Wallet not connected"
- Ensure Petra wallet is installed
- Click "Connect Wallet" button
- Approve connection in wallet popup

### "Bad chain" error
- Wallet network doesn't match UI network
- Switch network in Petra wallet settings
- Refresh the page

### "Insufficient balance"
- Check you have enough USDC for amount + fee
- On mainnet, fee is deducted from your USDC balance
- On testnet, transactions are free

### "Failed to sign transaction"
- Wallet rejected the signature request
- Try again and approve in wallet
- Check wallet is unlocked

---

## 📚 Resources

- **Dashboard**: [dashboard.smoothsend.xyz](https://dashboard.smoothsend.xyz)
- **Documentation**: [docs.smoothsend.xyz](https://docs.smoothsend.xyz)
- **GitHub**: [SmoothSend/smoothsendapifrontend](https://github.com/SmoothSend/smoothsendapifrontend)
- **Discord**: [discord.smoothsend.xyz](https://discord.smoothsend.xyz)
- **Website**: [smoothsend.xyz](https://smoothsend.xyz)
- **Twitter**: [@smoothsend](https://x.com/smoothsend)
- **Aptos Docs**: [aptos.dev](https://aptos.dev)
- **Script Composer**: [Aptos Script Composer SDK](https://github.com/aptos-labs/aptos-ts-sdk/tree/main/packages/script-composer-sdk)

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 💬 Support

Need help? Reach out:

- **Discord**: [Join our community](https://discord.smoothsend.xyz)
- **Email**: contact@smoothsend.xyz
- **Twitter**: [@smoothsend](https://x.com/smoothsend)

---

<div align="center">
  <p>Built with ❤️ by the SmoothSend team</p>
  <p>Making Web3 accessible, one gasless transaction at a time</p>
</div>
