import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface WhitelistData {
  whitelistedAddresses: string[];
  lastUpdated: string;
  version: string;
}

export function useWhitelist() {
  const { address, isConnected } = useAccount();
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [whitelistData, setWhitelistData] = useState<WhitelistData | null>(null);

  useEffect(() => {
    async function loadWhitelist() {
      try {
        // Dynamically fetch the whitelist to avoid caching issues
        const response = await fetch('/api/whitelist');
        let whitelist: WhitelistData;
        
        if (response.ok) {
          whitelist = await response.json();
        } else {
          // Fallback to hardcoded whitelist if API fails
          const whitelistModule = await import('@/data/whitelist.json');
          whitelist = whitelistModule.default as WhitelistData;
        }
        
        setWhitelistData(whitelist);
        
        console.log('🔍 Whitelist Check Debug:');
        console.log('  - isConnected:', isConnected);
        console.log('  - address:', address);
        console.log('  - whitelist addresses:', whitelist.whitelistedAddresses);
        
        if (!isConnected || !address) {
          console.log('  - Result: Not connected or no address');
          setIsWhitelisted(false);
          setIsLoading(false);
          return;
        }

        // Check if the connected wallet address is in the whitelist
        const lowerCaseWhitelist = whitelist.whitelistedAddresses.map(addr => addr.toLowerCase());
        const lowerCaseAddress = address.toLowerCase();
        const isAddressWhitelisted = lowerCaseWhitelist.includes(lowerCaseAddress);
        
        console.log('  - Address (lowercase):', lowerCaseAddress);
        console.log('  - Whitelist (lowercase):', lowerCaseWhitelist);
        console.log('  - Is Whitelisted:', isAddressWhitelisted);

        setIsWhitelisted(isAddressWhitelisted);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading whitelist:', error);
        setIsWhitelisted(false);
        setIsLoading(false);
      }
    }

    loadWhitelist();
  }, [address, isConnected]);

  return {
    isWhitelisted,
    isLoading,
    whitelistData,
  };
}

// Utility function to check if an address is whitelisted (for server-side or static checks)
export async function checkAddressWhitelist(address: string): Promise<boolean> {
  try {
    const whitelistModule = await import('@/data/whitelist.json');
    const whitelist = whitelistModule.default as WhitelistData;
    
    return whitelist.whitelistedAddresses
      .map(addr => addr.toLowerCase())
      .includes(address.toLowerCase());
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return false;
  }
}