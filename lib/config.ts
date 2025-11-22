/**
 * Application configuration loaded from environment variables
 */

export const config = {
  smoothsend: {
    apiUrl: process.env.NEXT_PUBLIC_SMOOTHSEND_API_URL,
    apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY 
  },
  defaultNetwork: (process.env.NEXT_PUBLIC_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  isDevelopment: process.env.NODE_ENV === 'development'
} as const

export type Network = 'testnet' | 'mainnet'
