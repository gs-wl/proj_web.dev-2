'use client';

import React from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { DollarSign, Lock, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';
import { useStaking } from '@/hooks/useStaking';
import { SUPPORTED_TOKENS } from '@/lib/web3-config';

export function WalletStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { userStakes } = useStaking();
  const [selectedStakeToken, setSelectedStakeToken] = React.useState<string>('all');
  const [isStakeDropdownOpen, setIsStakeDropdownOpen] = React.useState(false);
  const stakeDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stakeDropdownRef.current && !stakeDropdownRef.current.contains(event.target as Node)) {
        setIsStakeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get native token balance (ETH, MATIC, etc.)
  const { data: nativeBalance } = useBalance({
    address,
  });

  // Calculate staked amounts by token
  const stakedByToken = React.useMemo(() => {
    if (!userStakes) return {};
    const staked: Record<string, number> = {};
    userStakes.forEach(stake => {
      const token = SUPPORTED_TOKENS.find(t => 
        t.addresses[chainId] === stake.token
      );
      const symbol = token?.symbol || 'Unknown';
      staked[symbol] = (staked[symbol] || 0) + Number(formatEther(stake.amount));
    });
    return staked;
  }, [userStakes, chainId]);

  // Calculate total staked value
  const totalStaked = React.useMemo(() => {
    return Object.values(stakedByToken).reduce((total, amount) => total + amount, 0);
  }, [stakedByToken]);

  // Get available staked tokens
  const availableStakedTokens = React.useMemo(() => {
    return Object.keys(stakedByToken).filter(token => stakedByToken[token] > 0);
  }, [stakedByToken]);

  // Get displayed staked amount based on selection
  const displayedStakedAmount = React.useMemo(() => {
    if (selectedStakeToken === 'all') {
      return totalStaked;
    }
    return stakedByToken[selectedStakeToken] || 0;
  }, [selectedStakeToken, totalStaked, stakedByToken]);

  // Calculate total rewards earned
  const totalRewards = React.useMemo(() => {
    if (!userStakes) return 0;
    return userStakes.reduce((total, stake) => {
      return total + Number(formatEther(stake.rewards));
    }, 0);
  }, [userStakes]);

  // Calculate total rewards info for display
  const totalRewardsInfo = React.useMemo(() => {
    // Mock data for claimable rewards (replace with actual data when available)
    const mockClaimableRewards = [
      { asset: 'ONT', availableRewards: 12.15, usdValue: 847.32, status: 'claimable' },
      { asset: 'ADA', availableRewards: 45.82, usdValue: 1205.75, status: 'claimable' },
      { asset: 'SOL', availableRewards: 2.35, usdValue: 425.60, status: 'claimable' },
      { asset: 'XRP', availableRewards: 8.75, usdValue: 312.85, status: 'claimable' }
    ];
    
    const claimable = mockClaimableRewards.filter(r => r.status === 'claimable');
    const totalUSD = claimable.reduce((sum, r) => sum + r.usdValue, 0);
    return { totalUSD, count: claimable.length };
  }, []);

  // Get token balances for supported tokens
  const TokenBalance = ({ tokenSymbol }: { tokenSymbol: string }) => {
    const { useTokenBalance } = useStaking();
    const { data: balance } = useTokenBalance(tokenSymbol);
    
    if (!balance) return null;
    
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <img 
            src={SUPPORTED_TOKENS.find(t => t.symbol === tokenSymbol)?.logo} 
            alt={tokenSymbol}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tokenSymbol}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {Number(formatEther(balance)).toLocaleString(undefined, { 
            maximumFractionDigits: 4 
          })}
        </span>
      </div>
    );
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Native Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {nativeBalance?.symbol || 'ETH'} Balance
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {nativeBalance ? 
              Number(formatEther(nativeBalance.value)).toLocaleString(undefined, { 
                maximumFractionDigits: 4 
              }) : 
              '0.0000'
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {nativeBalance?.symbol || 'ETH'}
          </p>
        </div>

        {/* Total Staked */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedStakeToken === 'all' ? 'Total Staked' : `${selectedStakeToken} Staked`}
              </span>
            </div>
            {availableStakedTokens.length > 0 && (
               <div className="relative" ref={stakeDropdownRef}>
                <button
                  onClick={() => setIsStakeDropdownOpen(!isStakeDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedStakeToken === 'all' ? 'All' : selectedStakeToken}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {isStakeDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 min-w-[100px]">
                    <button
                      onClick={() => {
                        setSelectedStakeToken('all');
                        setIsStakeDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      All
                    </button>
                    {availableStakedTokens.map(token => {
                      const tokenInfo = SUPPORTED_TOKENS.find(t => t.symbol === token);
                      return (
                        <button
                          key={token}
                          onClick={() => {
                            setSelectedStakeToken(token);
                            setIsStakeDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                          {tokenInfo && (
                            <img 
                              src={tokenInfo.logo} 
                              alt={token}
                              className="w-4 h-4"
                            />
                          )}
                          {token}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {displayedStakedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {selectedStakeToken === 'all' ? 'Tokens' : selectedStakeToken}
          </p>
        </div>

        {/* Total Rewards */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Rewards to Claim</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalRewardsInfo.totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalRewardsInfo.count} tokens available
          </p>
        </div>
      </div>



      {/* Active Stakes Summary */}
      {userStakes && userStakes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Stakes
          </h3>
          <div className="space-y-3">
            {userStakes.map((stake, index) => {
              const token = SUPPORTED_TOKENS.find(t => 
                t.addresses[chainId] === stake.token
              );
              const isActive = stake.endTime > BigInt(Math.floor(Date.now() / 1000));
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {token && (
                      <img 
                        src={token.logo} 
                        alt={token.symbol}
                        className="w-6 h-6"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {Number(formatEther(stake.amount)).toLocaleString()} {token?.symbol || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isActive ? 'Active' : 'Completed'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      +{Number(formatEther(stake.rewards)).toLocaleString()} {token?.symbol || ''}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rewards
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}