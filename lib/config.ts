/**
 * Application configuration loaded from environment variables
 */

export const config = {
  smoothsend: {
    apiUrl: process.env.NEXT_PUBLIC_SMOOTHSEND_API_URL || 'https://proxy.smoothsend.xyz/api/v1/relayer',
    apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY || 'no_gas_xxx'
  },
  defaultNetwork: (process.env.NEXT_PUBLIC_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  isDevelopment: process.env.NODE_ENV === 'development'
} as const

export type Network = 'testnet' | 'mainnet'
