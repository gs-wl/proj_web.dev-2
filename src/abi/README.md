# Contract ABIs

This directory contains the Application Binary Interface (ABI) files for smart contracts used in the RWA DeFi Platform.

## Structure

- `staking/` - Staking contract ABIs
- `tokens/` - Token contract ABIs (ERC-20, RWA tokens)
- `rewards/` - Rewards distribution contract ABIs
- `governance/` - Governance contract ABIs
- `utils/` - Utility contract ABIs
- `interfaces/` - Interface ABIs

## Usage

ABI files are JSON files that define the contract interface and are used by the frontend to interact with deployed smart contracts.

## File Naming Convention

- Use PascalCase for contract names: `StakingContract.json`
- Include version if multiple versions exist: `StakingContractV2.json`
- Use descriptive names that match the contract purpose

## Integration

These ABIs are imported in the web3 configuration files and used with wagmi/viem for type-safe contract interactions.