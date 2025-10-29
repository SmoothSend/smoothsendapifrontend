const APTOS_TESTNET_URL = "https://fullnode.testnet.aptoslabs.com/v1"
const APTOS_MAINNET_URL = "https://fullnode.mainnet.aptoslabs.com/v1"

export function getAptosNodeUrl(network: "testnet" | "mainnet") {
  return network === "testnet" ? APTOS_TESTNET_URL : APTOS_MAINNET_URL
}

interface CoinBalance {
  asset_type: string
  amount: string
  metadata?: {
    decimals: number
  }
}

export async function getCoinBalances(address: string, network: "testnet" | "mainnet") {
  const nodeUrl = getAptosNodeUrl(network)

  try {
    const coinBalances: CoinBalance[] = []

    // 1. Get old Coin standard balances (APT uses this)
    const resourcesResponse = await fetch(`${nodeUrl}/accounts/${address}/resources`)
    
    if (!resourcesResponse.ok) {
      throw new Error(`Failed to fetch resources: ${resourcesResponse.statusText}`)
    }

    const resources = await resourcesResponse.json()
    
    resources
      .filter((resource: any) => resource.type.includes("::coin::CoinStore<"))
      .forEach((resource: any) => {
        const coinType = resource.type.match(/<(.+)>/)?.[1] || ""
        coinBalances.push({
          asset_type: coinType,
          amount: resource.data.coin.value,
          metadata: { decimals: 8 } // APT uses 8 decimals
        })
      })

    // 2. Get USDC balance using view function (Fungible Asset standard)
    const USDC_ADDRESSES = {
      testnet: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
      mainnet: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b"
    }
    
    const usdcAddress = USDC_ADDRESSES[network as keyof typeof USDC_ADDRESSES]
    
    try {
      const viewResponse = await fetch(`${nodeUrl}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: "0x1::primary_fungible_store::balance",
          type_arguments: ["0x1::fungible_asset::Metadata"],
          arguments: [address, usdcAddress]
        })
      })

      if (viewResponse.ok) {
        const [balance] = await viewResponse.json()
        if (balance && balance !== "0") {
          coinBalances.push({
            asset_type: usdcAddress,
            amount: balance,
            metadata: { decimals: 6 } // USDC uses 6 decimals
          })
        }
      }
    } catch (e) {
      console.log("No USDC balance found or error fetching:", e)
    }

    return coinBalances
  } catch (error) {
    console.error("[v0] Error fetching coin balances:", error)
    return []
  }
}

// Parse coin type to get symbol
export function parseCoinType(coinType: string): string {
  const parts = coinType.split("::")
  if (parts.length >= 3) {
    return parts[2].replace("Coin", "").toUpperCase()
  }
  return "UNKNOWN"
}
