# 🏗️ SmoothSend Project Architecture

## 📂 Project Overview

The SmoothSend ecosystem consists of multiple projects with different purposes:

### 1. **smoothsend-demo** (This Project)
- **Type**: Aptos Frontend (Next.js)
- **Purpose**: Gasless transactions on Aptos blockchain
- **Authentication**: API Key System (Public Key)
- **Target**: End users who want gasless Aptos transactions

```bash
Location: /home/ved-mohan/Desktop/SMOOTHSEND/smoothsend-demo
API: https://proxy.smoothsend.xyz/api/v1/relayer
Auth: pk_nogas_C4EMY4mysb6G7CaxXpAcRAECRGHTZLGC (Public Key)
```

### 2. **frontend**
- **Type**: EVM Frontend (Next.js)
- **Purpose**: Gasless EVM transactions (Ethereum, Avalanche, Polygon, etc.)
- **Authentication**: Direct relayer connection (no API keys)
- **Target**: EVM users with MetaMask

```bash
Location: /home/ved-mohan/Desktop/SMOOTHSEND/frontend
API: http://localhost:3000/api/v1/relayer (direct relayer)
Auth: None (direct connection to owned relayer)
```

### 3. **relayer** / **aptosrelayer**
- **Type**: Backend Services
- **Purpose**: Gas sponsorship and transaction relay
- **Authentication**: Validates API keys from dashboard
- **Target**: Internal service (not user-facing)

## 🔑 Authentication Systems

### For Aptos (smoothsend-demo)
**Dual-Key System via Dashboard:**

```typescript
// Frontend uses Public Key
NEXT_PUBLIC_SMOOTHSEND_API_KEY=pk_nogas_C4EMY4mysb6G7CaxXpAcRAECRGHTZLGC

// Backend would use Secret Key (not needed in smoothsend-demo)
// SMOOTHSEND_SECRET_KEY=sk_nogas_uyPVMQq3P2TlTmQkF6CPNT8YjYwSFcrw
```

**Why API Keys?**
- SmoothSend offers Aptos gasless as a **SaaS service**
- Users pay per transaction ($0.01 on mainnet, FREE on testnet)
- Dashboard manages billing, usage tracking, and rate limits
- Multiple teams can use the same relayer with different keys

### For EVM (frontend)
**Direct Connection (No API Keys):**

```typescript
// Frontend connects directly to your own relayer
NEXT_PUBLIC_RELAYER_URL=http://localhost:3000
```

**Why No API Keys?**
- You own and operate your own EVM relayer
- It's not a shared service
- No billing or usage tracking needed
- Full control over gas sponsorship

## 🌐 Network Support

### Aptos (smoothsend-demo)
| Network | Chain | Relayer | Cost |
|---------|-------|---------|------|
| Testnet | Aptos | proxy.smoothsend.xyz | FREE |
| Mainnet | Aptos | proxy.smoothsend.xyz | $0.01/tx |

### EVM (frontend)
| Network | Chain ID | Relayer | Cost |
|---------|----------|---------|------|
| Avalanche Fuji | 43113 | localhost:3000 | FREE (your gas) |
| Avalanche Mainnet | 43114 | localhost:3000 | Your gas costs |
| Ethereum | 1 | localhost:3000 | Your gas costs |
| Polygon | 137 | localhost:3000 | Your gas costs |

## 🔄 Transaction Flows

### Aptos Flow (smoothsend-demo)
```
User → Frontend → SmoothSend API (with API key) → Aptos Blockchain
                   ↓
            Dashboard tracks usage
                   ↓
            Bill user monthly
```

### EVM Flow (frontend)
```
User → Frontend → Your Relayer (no auth) → EVM Blockchain
                   ↓
            You pay gas costs directly
```

## 💰 Cost Models

### Aptos (SaaS Model)
- **Testnet**: FREE (unlimited for development)
- **Mainnet**: $0.01 per transaction
- **Billing**: Monthly via dashboard
- **Tiers**: Free (100 tx/mo), Starter ($49), Pro ($199), Enterprise

### EVM (Self-Hosted Model)
- **All Networks**: You pay gas costs
- **No Service Fee**: It's your relayer
- **Infrastructure**: You manage server costs
- **Flexibility**: Full control, no limits

## 🎯 Use Cases

### When to Use Aptos (smoothsend-demo)
✅ Building on Aptos blockchain  
✅ Want managed gasless service  
✅ Don't want to manage relayer infrastructure  
✅ Need usage tracking and analytics  
✅ Multiple teams sharing infrastructure  

### When to Use EVM (frontend)
✅ Building on Ethereum/Avalanche/Polygon  
✅ Want full control over gas sponsorship  
✅ Running your own infrastructure  
✅ Need custom relayer logic  
✅ Single team/project  

## 🔧 API Differences

### Aptos API (smoothsend-demo)
```typescript
// Requires API key in headers
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'pk_nogas_xxx' // Required!
  },
  body: JSON.stringify(data)
})
```

### EVM API (frontend)
```typescript
// No API key needed
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // No X-API-Key header
  },
  body: JSON.stringify(data)
})
```

## 📊 Feature Comparison

| Feature | Aptos (smoothsend-demo) | EVM (frontend) |
|---------|------------------------|----------------|
| **Blockchain** | Aptos | Ethereum, Avalanche, etc. |
| **Auth** | API Keys (pk_nogas_xxx) | None (direct) |
| **Hosting** | SaaS (proxy.smoothsend.xyz) | Self-hosted |
| **Cost** | Pay per tx | Pay gas costs |
| **Dashboard** | ✅ Usage tracking | ❌ No dashboard |
| **Rate Limits** | ✅ Tier-based | ❌ Unlimited |
| **Managed** | ✅ Fully managed | ❌ You manage |
| **Setup** | API key only | Run relayer service |

## 🚀 Getting Started

### For Aptos Development (smoothsend-demo)
```bash
cd smoothsend-demo
npm install
cp .env.example .env.local
# Add your API key from dashboard.smoothsend.xyz
npm run dev
```

### For EVM Development (frontend)
```bash
# Terminal 1: Start relayer
cd relayer
npm install
npm run dev

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
```

## 📝 Summary

**smoothsend-demo (Aptos)**:
- ✅ Updated to new API key format (`pk_nogas_xxx`)
- ✅ Ready for both testnet and mainnet
- ✅ Uses SmoothSend managed service
- ✅ Documentation complete

**frontend (EVM)**:
- ✅ No API keys needed
- ✅ Connects to your own relayer
- ✅ Full control over gas sponsorship
- ✅ Different architecture pattern

Both projects demonstrate gasless transactions, but with different authentication models based on whether you're using a managed service (Aptos) or self-hosting (EVM).

---

**Last Updated**: November 9, 2025  
**Version**: 2.0
