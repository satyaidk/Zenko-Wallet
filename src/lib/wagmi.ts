import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, monadTestnet, base } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'Portfolio Wallet DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [mainnet, polygon, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ID ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : undefined),
    [polygon.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ID ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : undefined),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ID ? `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : undefined),
    [optimism.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ID ? `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : undefined),
    [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ID ? `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : undefined),
    [monadTestnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ID ? `https://monad-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : undefined),
  },
  ssr: true,
});
