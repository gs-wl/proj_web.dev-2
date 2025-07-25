'use client'

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWhitelist } from '@/hooks/useWhitelist';
import { useRouter } from 'next/navigation';

interface WhitelistGuardProps {
  children: React.ReactNode;
}

export function WhitelistGuard({ children }: WhitelistGuardProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { isWhitelisted, isLoading } = useWhitelist();

  useEffect(() => {
    // Only redirect if wallet is connected and not whitelisted
    if (isConnected && !isLoading && !isWhitelisted) {
      router.push('/waitlist');
    }
  }, [isConnected, isLoading, isWhitelisted, router]);

  // Show loading state while checking whitelist
  if (isConnected && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Checking whitelist status...</p>
        </div>
      </div>
    );
  }

  // If connected but not whitelisted, don't render children (redirect will happen)
  if (isConnected && !isWhitelisted) {
    return null;
  }

  // Render children if not connected or if whitelisted
  return <>{children}</>;
}