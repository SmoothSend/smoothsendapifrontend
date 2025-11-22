# 🔐 Aptos Wallet Standard Implementation

## Overview

This project implements the **Aptos Wallet Standard (AIP-62)** for seamless wallet integration. The standard ensures interoperability between different Aptos wallets (Petra, Martian, Pontem, etc.) without requiring dapp developers to write custom code for each wallet.

## 📚 Reference

- **Standard**: [Aptos Wallet Standard (AIP-62)](https://aptos.dev/standards/wallets)
- **Documentation**: [Aptos Wallet Integration](https://aptos.dev/guides/wallet-standard)
- **Package**: `@aptos-labs/wallet-adapter-react`

---

## 🏗️ Implementation Architecture

### 1. Wallet Provider Setup

**File**: `providers/wallet-provider.tsx`

```tsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { PetraWallet } from "petra-plugin-wallet-adapter"

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [new PetraWallet()], [])

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.error("Wallet adapter error:", error)
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
```

**Key Features:**
- ✅ Implements `AptosWalletAdapterProvider` from the standard
- ✅ Supports plugin-based wallet architecture
- ✅ Auto-connect for better UX
- ✅ Error handling for wallet failures

### 2. Wallet Connection Component

**File**: `components/wallet-connect.tsx`

```tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets } = useWallet()
  
  // Connect to wallet
  const handleConnect = async (walletName: string) => {
    await connect(walletName)
  }
  
  // Disconnect wallet
  const handleDisconnect = async () => {
    await disconnect()
  }
}
```

**Standard Compliance:**
- ✅ Uses `useWallet()` hook from adapter
- ✅ Lists all available wallets dynamically
- ✅ Handles wallet detection (shows install prompt if not found)
- ✅ Proper error handling for connection failures

### 3. Transaction Signing

**File**: `components/transfer-form.tsx`

```tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export function TransferForm() {
  const { account, connected, signTransaction } = useWallet()
  
  const handleSubmit = async () => {
    // Validate wallet connection
    if (!connected || !account) {
      throw new Error('Wallet is not connected')
    }
    
    if (!signTransaction) {
      throw new Error('Wallet does not support transaction signing')
    }
    
    // Sign transaction
    const signResponse = await signTransaction({ 
      transactionOrPayload: transaction 
    })
  }
}
```

**Standard Compliance:**
- ✅ Validates wallet connection before signing
- ✅ Checks for `signTransaction` feature support
- ✅ Uses standard signing interface
- ✅ Handles authenticator bytes correctly

---

## 🔑 Key Components of the Standard

### 1. Wallet Interface (`AptosWallet`)

The standard defines a wallet interface that all wallets must implement:

```typescript
interface AptosWallet {
  url: string;
  version: "1.0.0";
  name: string;
  icon: string; // Base64 encoded image
  chains: AptosChain;
  features: AptosFeatures;
  accounts: readonly AptosWalletAccount[];
}
```

**Our Implementation:**
- ✅ Petra wallet implements this interface
- ✅ Wallet adapter handles registration automatically
- ✅ Future wallets (Martian, Pontem) will work without code changes

### 2. Wallet Account (`AptosWalletAccount`)

Each connected account has this structure:

```typescript
interface AptosWalletAccount {
  address: string;
  publicKey: Uint8Array;
  chains: AptosChain;
  features: AptosFeatures;
  variant: AptosAccountVariant; // Ed25519, MultiEd25519, etc.
  label?: string;
  icon?: string;
}
```

**Our Usage:**
```tsx
const { account } = useWallet()
const address = account?.address?.toString() // "0x123..."
```

### 3. Account Variants

The standard supports multiple signature schemes:

```typescript
enum AptosAccountVariant {
  Ed25519,        // Single signature
  MultiEd25519,   // Multi-sig
  SingleKey,      // Single key (new)
  MultiKey,       // Multi-key (new)
}
```

**Our Support:**
- ✅ Works with all variants automatically
- ✅ Wallet adapter handles serialization
- ✅ No custom code needed per variant

---

## 🌐 Multi-Wallet Support

### Current Configuration

```tsx
const wallets = useMemo(() => [
  new PetraWallet()
], [])
```

### Expanded Multi-Wallet Support

To add more wallets following the standard:

```tsx
import { PetraWallet } from "petra-plugin-wallet-adapter"
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter"
import { PontemWallet } from "@pontem/wallet-adapter-plugin"
import { RiseWallet } from "@rise-wallet/wallet-adapter"

const wallets = useMemo(() => [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new RiseWallet(),
], [])
```

**Benefits:**
- ✅ No code changes in components
- ✅ All wallets use same API
- ✅ Users can choose their preferred wallet
- ✅ Wallet detection is automatic

---

## 🔐 Key Rotation Support

The Aptos Wallet Standard includes key rotation support:

### How It Works

1. **User rotates keys** in their wallet
2. **Wallet derives new authentication key** from private key
3. **Wallet looks up account** in on-chain origination table
4. **Returns correct address** (original or rotated)

### Our Implementation

```tsx
const { account } = useWallet()
// account.address is always correct, even after rotation
```

**Standard Compliance:**
- ✅ Wallet adapter handles key rotation automatically
- ✅ Address lookup is done by wallet, not dapp
- ✅ No special code needed in our dapp
- ✅ Works seamlessly for users

---

## 🔒 Security Features

### 1. Transaction Validation

```tsx
// Validate wallet connection
if (!connected || !account) {
  throw new Error('Wallet is not connected')
}

// Validate signing capability
if (!signTransaction) {
  throw new Error('Wallet does not support transaction signing')
}
```

### 2. Error Handling

```tsx
const handleConnect = async (walletName: string) => {
  try {
    await connect(walletName)
  } catch (error) {
    console.error("Failed to connect wallet:", error)
    alert(`Failed to connect: ${error.message}`)
  }
}
```

### 3. Wallet Detection

```tsx
{(!wallets || wallets.length === 0) && (
  <div className="text-center">
    No wallets detected. Please install Petra wallet.
    <a href="https://petra.app/" target="_blank">
      Install Petra
    </a>
  </div>
)}
```

---

## 🎯 Standard Features We Use

### ✅ Required Features (All Implemented)

| Feature | Description | Our Usage |
|---------|-------------|-----------|
| `aptos:connect` | Connect wallet | `connect(walletName)` |
| `aptos:disconnect` | Disconnect wallet | `disconnect()` |
| `aptos:account` | Get account info | `account.address` |
| `aptos:signTransaction` | Sign transaction | `signTransaction(tx)` |

### 🔄 Optional Features (Not Yet Used)

| Feature | Description | Future Use |
|---------|-------------|------------|
| `aptos:signMessage` | Sign arbitrary message | Message signing |
| `aptos:signAndSubmitTransaction` | Sign + submit in one call | Simplified flow |
| `aptos:onAccountChange` | Listen to account changes | Multi-account |
| `aptos:onNetworkChange` | Listen to network changes | Network sync |

---

## 📱 Wallet Registration Flow

### How Wallets Register (Standard Process)

```typescript
// Wallet extension does this automatically
import { registerWallet } from "@aptos-labs/wallet-standard"

const myWallet = new MyWallet()
registerWallet(myWallet)
```

### How Dapp Discovers Wallets

```typescript
// Our wallet adapter does this automatically
import { getAptosWallets } from "@aptos-labs/wallet-standard"

let { aptosWallets, on } = getAptosWallets()

// Listen for new wallets
on("register", () => {
  let { aptosWallets } = getAptosWallets()
  // Update UI with new wallet
})
```

**Our Implementation:**
- ✅ Wallet adapter handles discovery automatically
- ✅ Wallets appear dynamically in dropdown
- ✅ No manual polling needed
- ✅ Works even if dapp loads before wallet

---

## 🧪 Testing Wallet Integration

### 1. Test Wallet Detection

```bash
# Open browser console
console.log('Available wallets:', window.aptos)
```

### 2. Test Connection

```tsx
// Click "Connect Wallet" button
// Should see list of installed wallets
// Should connect without errors
```

### 3. Test Transaction Signing

```tsx
// Fill out transfer form
// Click "Send Transaction"
// Wallet popup should appear
// Sign transaction
// Should see success message
```

### 4. Test Disconnection

```tsx
// Click disconnect button
// Should clear wallet state
// Should show "Connect Wallet" button again
```

---

## 🚀 Future Enhancements

### 1. Add More Wallets

```tsx
// Add these packages
npm install @martianwallet/aptos-wallet-adapter
npm install @pontem/wallet-adapter-plugin
npm install @rise-wallet/wallet-adapter

// Update wallet-provider.tsx
const wallets = useMemo(() => [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new RiseWallet(),
], [])
```

### 2. Add Message Signing

```tsx
const { signMessage } = useWallet()

const signCustomMessage = async () => {
  const message = "Sign this message to verify ownership"
  const response = await signMessage({ message })
  console.log('Signature:', response.signature)
}
```

### 3. Add Multi-Account Support

```tsx
const { accounts, account, setAccount } = useWallet()

// Switch between accounts
const switchAccount = (newAccount) => {
  setAccount(newAccount)
}
```

### 4. Add Network Change Listener

```tsx
const { network, onNetworkChange } = useWallet()

useEffect(() => {
  const unsubscribe = onNetworkChange((newNetwork) => {
    console.log('Network changed:', newNetwork)
    // Update UI
  })
  
  return unsubscribe
}, [])
```

---

## 📖 BIP44 Derivation Path

The standard uses BIP44 for account derivation:

### Aptos Derivation Path

```
m/44'/637'/0'/0'/0'
```

- `44'` - BIP44 standard
- `637'` - Aptos coin type
- `0'` - Account index (for one mnemonic → many accounts)
- `0'` - Change index (always 0 for Aptos)
- `0'` - Address index (always 0 for Aptos)

### Our Implementation

```tsx
// Wallet handles derivation automatically
// We just get the derived address
const { account } = useWallet()
const address = account?.address // Already derived
```

**Petra Wallet:**
- Uses one mnemonic per account
- Path: `m/44'/637'/0'/0'/0'`
- Recommended by standard

**Other Wallets:**
- May use one mnemonic → many accounts
- Path: `m/44'/637'/i'/0'/0'` (i = account index)
- Supported by standard, but more complex for key rotation

---

## 🔗 Resources

### Official Documentation
- [Aptos Wallet Standard](https://aptos.dev/standards/wallets)
- [Wallet Adapter Docs](https://aptos.dev/guides/wallet-adapter)
- [AIP-62 Proposal](https://github.com/aptos-foundation/AIPs/blob/main/aips/aip-62.md)

### Wallet Downloads
- [Petra Wallet](https://petra.app/) - Recommended
- [Martian Wallet](https://martianwallet.xyz/)
- [Pontem Wallet](https://pontem.network/wallet)
- [Rise Wallet](https://risewallet.io/)

### Code Repositories
- [Wallet Adapter](https://github.com/aptos-labs/aptos-wallet-adapter)
- [Aptos TypeScript SDK](https://github.com/aptos-labs/aptos-ts-sdk)
- [Petra Wallet Adapter](https://github.com/petra-wallet/petra-wallet-adapter)

---

## ✅ Compliance Checklist

### Required by Standard

- ✅ Uses `@aptos-labs/wallet-adapter-react`
- ✅ Implements `AptosWalletAdapterProvider`
- ✅ Registers wallet plugins
- ✅ Uses standard `useWallet()` hook
- ✅ Handles `connect()` and `disconnect()`
- ✅ Validates wallet connection
- ✅ Uses `signTransaction()` for signing
- ✅ Handles authenticator bytes correctly
- ✅ Displays wallet icons
- ✅ Shows install prompts for missing wallets

### Best Practices

- ✅ Auto-connect for better UX
- ✅ Error handling for all wallet operations
- ✅ Loading states during operations
- ✅ Graceful fallbacks for missing features
- ✅ User-friendly error messages
- ✅ Responsive wallet UI
- ✅ Secure transaction validation

### Future Improvements

- 🔄 Add more wallet plugins (Martian, Pontem, Rise)
- 🔄 Implement message signing feature
- 🔄 Add multi-account support
- 🔄 Add network change listener
- 🔄 Add account change listener

---

**Last Updated**: November 9, 2025  
**Standard Version**: AIP-62 (Wallet Standard 1.0)  
**Compliance Status**: ✅ Fully Compliant
