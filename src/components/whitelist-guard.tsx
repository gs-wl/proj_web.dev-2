'use client'

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useWhitelist } from '@/hooks/useWhitelist';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, UserPlus } from 'lucide-react';

interface WhitelistGuardProps {
  children: React.ReactNode;
}

export function WhitelistGuard({ children }: WhitelistGuardProps) {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { isWhitelisted, isLoading } = useWhitelist();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    // Only show access denied message if wallet is connected and not whitelisted
    // Don't automatically redirect to avoid disrupting user experience
    if (isConnected && !isLoading && !isWhitelisted) {
      setShowAccessDenied(true);
    } else {
      setShowAccessDenied(false);
    }
  }, [isConnected, isLoading, isWhitelisted]);

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

  // If connected but not whitelisted, show access denied message instead of redirecting
  if (isConnected && !isWhitelisted && showAccessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-2">Your wallet address is not whitelisted for this application.</p>
          <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded break-all">
            {address}
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/whitelist')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Whitelist
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Need help? Contact our support team.
          </p>
        </div>
      </div>
    );
  }

  // Render children if not connected or if whitelisted
  return <>{children}</>;
}