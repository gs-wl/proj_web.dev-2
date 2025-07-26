// Contract ABI exports for the RWA DeFi Platform

// Staking contracts
import StakingContractABI from './staking/StakingContract.json';

// Token contracts
import ERC20TokenABI from './tokens/ERC20Token.json';

// Export all ABIs
export const ABIS = {
  // Staking
  StakingContract: StakingContractABI,
  
  // Tokens
  ERC20Token: ERC20TokenABI,
} as const;

// Type-safe ABI access
export type ABIName = keyof typeof ABIS;

// Helper function to get ABI by name
export function getABI(name: ABIName) {
  return ABIS[name];
}

// Re-export individual ABIs for direct imports
export {
  StakingContractABI,
  ERC20TokenABI,
};