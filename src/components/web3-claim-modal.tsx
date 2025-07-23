'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift, AlertCircle, CheckCircle, Loader2, ExternalLink, Clock, Coins } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { useStaking } from '@/hooks/useStaking';
import { SUPPORTED_TOKENS } from '@/lib/web3-config';

interface Web3ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets?: string[];
}

export function Web3ClaimModal({ isOpen, onClose, selectedAssets = [] }: Web3ClaimModalProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { 
    userStakes,
    usePendingRewards, 
    claimRewards, 
    isLoading, 
    error 
  } = useStaking();

  const [step, setStep] = useState<'select' | 'claim' | 'success'>('select');
  const [selectedStakeIds, setSelectedStakeIds] = useState<bigint[]>([]);
  const [txHash, setTxHash] = useState<string>('');

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedStakeIds([]);
      setTxHash('');
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  // Get claimable stakes
  const claimableStakes = React.useMemo(() => {
    if (!userStakes) return [];
    
    return userStakes.filter(stake => {
      const isMatured = stake.endTime <= BigInt(Math.floor(Date.now() / 1000));
      const hasRewards = stake.rewards > BigInt(0);
      const notClaimed = !stake.claimed;
      
      return isMatured && hasRewards && notClaimed;
    });
  }, [userStakes]);

  // Calculate total claimable rewards
  const totalClaimableRewards = React.useMemo(() => {
    return selectedStakeIds.reduce((total, stakeId) => {
      const stake = claimableStakes.find(s => s.id === stakeId);
      return total + (stake ? Number(formatEther(stake.rewards)) : 0);
    }, 0);
  }, [selectedStakeIds, claimableStakes]);

  // Calculate total USD value (mock calculation)
  const totalUsdValue = React.useMemo(() => {
    return totalClaimableRewards * 2.5; // Mock USD conversion rate
  }, [totalClaimableRewards]);

  const handleStakeSelection = (stakeId: bigint) => {
    setSelectedStakeIds(prev => 
      prev.includes(stakeId) 
        ? prev.filter(id => id !== stakeId)
        : [...prev, stakeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStakeIds.length === claimableStakes.length) {
      setSelectedStakeIds([]);
    } else {
      setSelectedStakeIds(claimableStakes.map(stake => stake.id));
    }
  };

  const handleClaim = async () => {
    if (selectedStakeIds.length === 0) return;
    
    try {
      setStep('claim');
      
      // Claim rewards for each selected stake
      for (const stakeId of selectedStakeIds) {
        await claimRewards(stakeId);
      }
      
      setStep('success');
    } catch (err) {
      console.error('Claiming failed:', err);
      setStep('select');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-in"
           onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Claim Rewards</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isConnected ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Wallet Not Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to claim rewards.
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Rewards Claimed!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Successfully claimed {totalClaimableRewards.toFixed(4)} tokens in rewards.
            </p>
            {txHash && (
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                View Transaction <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Close
            </button>
          </div>
        ) : claimableStakes.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Rewards Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any claimable rewards at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Reward Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-center space-y-2">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {selectedStakeIds.length === 0 ? 'Available Rewards' : `${selectedStakeIds.length} Stakes Selected`}
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-300">
                  ${totalUsdValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total USD Value
                </p>
              </div>
            </div>

            {/* Reward Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Stakes
                </h3>
                <button
                  onClick={handleSelectAll}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  {selectedStakeIds.length === claimableStakes.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              {/* Individual Reward Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {claimableStakes.map((stake) => {
                  const token = SUPPORTED_TOKENS.find(t => 
                    t.addresses[chainId] === stake.token
                  );
                  const isSelected = selectedStakeIds.includes(stake.id);
                  const rewardAmount = Number(formatEther(stake.rewards));
                  const usdValue = rewardAmount * 2.5; // Mock USD conversion
                  
                  return (
                    <div 
                      key={stake.id.toString()} 
                      className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleStakeSelection(stake.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${token?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                            {token?.logo ? (
                              <img src={token.logo} alt={token.symbol} className="w-5 h-5" />
                            ) : (
                              <span className="text-white text-xs font-bold">{token?.symbol?.slice(0, 2) || '??'}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{token?.symbol || 'Unknown'}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Staked: {Number(formatEther(stake.amount)).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {rewardAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token?.symbol}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            ${usdValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Selected Stakes</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedStakeIds.length} of {claimableStakes.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Total USD Value</span>
                  <span className="font-medium text-green-600 dark:text-green-400">${totalUsdValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">~0.003 ETH</span>
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Claiming Notice</p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    Rewards are automatically compounded if not claimed within 7 days. Network fees apply for manual claims.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleClaim}
                disabled={selectedStakeIds.length === 0 || isLoading}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedStakeIds.length > 0 && !isLoading
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Coins className="w-5 h-5" /> 
                    {selectedStakeIds.length === 0 
                      ? 'Select Stakes to Claim'
                      : `Claim ${selectedStakeIds.length} Rewards ($${totalUsdValue.toLocaleString()})`
                    }
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}