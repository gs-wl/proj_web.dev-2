import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RWA.defi Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [mainnet, polygon, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Contract addresses for different chains
export const CONTRACT_ADDRESSES: Record<number, {
  stakingContract: string;
  rewardsContract: string;
  tokenContract: string;
}> = {
  [mainnet.id]: {
    stakingContract: '0x...',
    rewardsContract: '0x...',
    tokenContract: '0x...',
  },
  [polygon.id]: {
    stakingContract: '0x...',
    rewardsContract: '0x...',
    tokenContract: '0x...',
  },
  [arbitrum.id]: {
    stakingContract: '0x...',
    rewardsContract: '0x...',
    tokenContract: '0x...',
  },
  [base.id]: {
    stakingContract: '0x...',
    rewardsContract: '0x...',
    tokenContract: '0x...',
  },
};

// Supported tokens for staking
export const SUPPORTED_TOKENS: Array<{
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  color: string;
  addresses: Record<number, string>;
}> = [
  {
    symbol: 'ADA',
    name: 'Cardano',
    decimals: 18,
    logo: '/ada.svg',
    color: 'from-blue-500 to-blue-600',
    addresses: {
      [mainnet.id]: '0x...',
      [polygon.id]: '0x...',
      [arbitrum.id]: '0x...',
      [base.id]: '0x...',
    }
  },
  {
    symbol: 'ONT',
    name: 'Ontology',
    decimals: 18,
    logo: '/ont.svg',
    color: 'from-green-500 to-green-600',
    addresses: {
      [mainnet.id]: '0x...',
      [polygon.id]: '0x...',
      [arbitrum.id]: '0x...',
      [base.id]: '0x...',
    }
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 18,
    logo: '/sol.svg',
    color: 'from-purple-500 to-purple-600',
    addresses: {
      [mainnet.id]: '0x...',
      [polygon.id]: '0x...',
      [arbitrum.id]: '0x...',
      [base.id]: '0x...',
    }
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 18,
    logo: '/dot.svg',
    color: 'from-pink-500 to-pink-600',
    addresses: {
      [mainnet.id]: '0x...',
      [polygon.id]: '0x...',
      [arbitrum.id]: '0x...',
      [base.id]: '0x...',
    }
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    decimals: 18,
    logo: '/xrp.svg',
    color: 'from-indigo-500 to-indigo-600',
    addresses: {
      [mainnet.id]: '0x...',
      [polygon.id]: '0x...',
      [arbitrum.id]: '0x...',
      [base.id]: '0x...',
    }
  },
];