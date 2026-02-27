import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { avalancheFuji } from 'wagmi/chains'

// 1. Get projectId from https://cloud.walletconnect.com
// We use a public dummy project ID for demonstration purposes
const projectId = 'd2e5a610f449298bf3eb24e107f4369e' 

// 2. Create wagmiConfig
const metadata = {
  name: 'Predix',
  description: 'Polymarket-style prediction market on Avalanche',
  url: 'https://predix.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [avalancheFuji] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})
