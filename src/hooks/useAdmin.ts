'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AdminData {
  adminAddresses: string[];
  lastUpdated: string;
  version: string;
}

export function useAdmin() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    async function loadAdminList() {
      try {
        // Dynamically fetch the admin list
        const response = await fetch('/api/admin-wallets');
        let adminList: AdminData;
        
        if (response.ok) {
          adminList = await response.json();
        } else {
          // Fallback to hardcoded admin list if API fails
          const adminModule = await import('@/data/admin-wallets.json');
          adminList = adminModule.default as AdminData;
        }
        
        setAdminData(adminList);
        
        console.log('🔍 Admin Check Debug:');
        console.log('  - isConnected:', isConnected);
        console.log('  - address:', address);
        console.log('  - admin addresses:', adminList.adminAddresses);
        
        if (!isConnected || !address) {
          console.log('  - Result: Not connected or no address');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Check if the connected wallet address is in the admin list
        const lowerCaseAdminList = adminList.adminAddresses.map(addr => addr.toLowerCase());
        const lowerCaseAddress = address.toLowerCase();
        const isAddressAdmin = lowerCaseAdminList.includes(lowerCaseAddress);
        
        console.log('  - Address (lowercase):', lowerCaseAddress);
        console.log('  - Admin list (lowercase):', lowerCaseAdminList);
        console.log('  - Is Admin:', isAddressAdmin);
        
        setIsAdmin(isAddressAdmin);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading admin list:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    }

    loadAdminList();
  }, [address, isConnected]);

  return {
    isAdmin,
    isLoading,
    adminData
  };
}