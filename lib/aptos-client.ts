const APTOS_TESTNET_URL = "https://fullnode.testnet.aptoslabs.com/v1"
const APTOS_MAINNET_URL = "https://fullnode.mainnet.aptoslabs.com/v1"

// Indexer GraphQL endpoints - much more reliable for balance queries
const INDEXER_TESTNET_URL = "https://api.testnet.aptoslabs.com/v1/graphql"
const INDEXER_MAINNET_URL = "https://api.mainnet.aptoslabs.com/v1/graphql"

export function getAptosNodeUrl(network: "testnet" | "mainnet") {
  return network === "testnet" ? APTOS_TESTNET_URL : APTOS_MAINNET_URL
}

export function getIndexerUrl(network: "testnet" | "mainnet") {
  return network === "testnet" ? INDEXER_TESTNET_URL : INDEXER_MAINNET_URL
}

interface CoinBalance {
  asset_type: string
  amount: string
  metadata?: {
    decimals: number
    symbol?: string
    name?: string
  }
}

// GraphQL query to fetch all fungible asset balances for an account
const FUNGIBLE_ASSET_BALANCES_QUERY = `
  query GetFungibleAssetBalances($address: String!) {
    current_fungible_asset_balances(
      where: { owner_address: { _eq: $address }, amount: { _gt: "0" } }
    ) {
      asset_type
      amount
      metadata {
        decimals
        symbol
        name
      }
    }
  }
`

export async function getCoinBalances(address: string, network: "testnet" | "mainnet", faAddresses: string[] = []): Promise<CoinBalance[]> {
  const indexerUrl = getIndexerUrl(network)
  
  try {
    // Use Indexer GraphQL API - fetches ALL fungible assets in one call
    const response = await fetch(indexerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: FUNGIBLE_ASSET_BALANCES_QUERY,
        variables: { address }
      })
    })

    if (!response.ok) {
      console.error(`Indexer request failed: ${response.status}`)
      return fallbackGetBalances(address, network, faAddresses)
    }

    const result = await response.json()
    
    if (result.errors) {
      console.error("GraphQL errors:", result.errors)
      return fallbackGetBalances(address, network, faAddresses)
    }

    const balances: CoinBalance[] = result.data?.current_fungible_asset_balances?.map((b: any) => ({
      asset_type: b.asset_type,
      amount: b.amount,
      metadata: {
        decimals: b.metadata?.decimals ?? 8,
        symbol: b.metadata?.symbol,
        name: b.metadata?.name
      }
    })) || []

    console.log(`[Indexer] Fetched ${balances.length} balances for ${address} on ${network}`)
    return balances

  } catch (error) {
    console.error("Indexer fetch failed, using fallback:", error)
    return fallbackGetBalances(address, network, faAddresses)
  }
}

// Fallback to node view functions if indexer fails
async function fallbackGetBalances(address: string, network: "testnet" | "mainnet", faAddresses: string[]): Promise<CoinBalance[]> {
  const nodeUrl = getAptosNodeUrl(network)
  const coinBalances: CoinBalance[] = []

  // 1. Get old Coin standard balances (APT uses this)
  try {
    const resourcesResponse = await fetch(`${nodeUrl}/accounts/${address}/resources`)

    if (resourcesResponse.ok) {
      const resources = await resourcesResponse.json()

      resources
        .filter((resource: any) => resource.type.includes("::coin::CoinStore<"))
        .forEach((resource: any) => {
          const coinType = resource.type.match(/<(.+)>/)?.[1] || ""
          coinBalances.push({
            asset_type: coinType,
            amount: resource.data.coin.value,
            metadata: { decimals: 8 }
          })
        })
    }
  } catch (e) {
    console.warn("Failed to fetch CoinStore resources:", e)
  }

  // 2. Get FA balances for provided addresses using view functions
  for (const faAddress of faAddresses) {
    if (!faAddress) continue

    try {
      const balanceResponse = await fetch(`${nodeUrl}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: "0x1::primary_fungible_store::balance",
          type_arguments: ["0x1::fungible_asset::Metadata"],
          arguments: [address, faAddress]
        })
      })

      if (balanceResponse.ok) {
        const [balance] = await balanceResponse.json()
        if (balance !== undefined && balance !== "0") {
          coinBalances.push({
            asset_type: faAddress,
            amount: String(balance),
            metadata: { decimals: 6 } // Default for stablecoins
          })
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch balance for ${faAddress}`, e)
    }
  }

  return coinBalances
}

// Parse coin type to get symbol
export function parseCoinType(coinType: string): string {
  const parts = coinType.split("::")
  if (parts.length >= 3) {
    return parts[2].replace("Coin", "").toUpperCase()
  }
  return "UNKNOWN"
}
