'use client';

import React, { useState, useEffect } from 'react';
import { X, Unlock, AlertCircle, CheckCircle, Loader2, ExternalLink, Clock, AlertTriangle, Calendar, TrendingDown } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { useStaking } from '@/hooks/useStaking';
import { SUPPORTED_TOKENS } from '@/lib/web3-config';

interface Web3UnstakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStakeId?: bigint;
}

export function Web3UnstakeModal({ isOpen, onClose, selectedStakeId }: Web3UnstakeModalProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { 
    userStakes,
    unstakeTokens, 
    isLoading, 
    error 
  } = useStaking();

  const [step, setStep] = useState<'confirm' | 'unstake' | 'success'>('confirm');
  const [txHash, setTxHash] = useState<string>('');
  const [confirmUnstake, setConfirmUnstake] = useState(false);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setTxHash('');
      setConfirmUnstake(false);
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

  // Get the selected stake
  const selectedStake = React.useMemo(() => {
    if (!userStakes || !selectedStakeId) return null;
    return userStakes.find(stake => stake.id === selectedStakeId);
  }, [userStakes, selectedStakeId]);

  // Get token info
  const token = React.useMemo(() => {
    if (!selectedStake || !chainId) return null;
    return SUPPORTED_TOKENS.find(t => t.addresses[chainId] === selectedStake.token);
  }, [selectedStake, chainId]);

  // Check if stake is matured
  const isMatured = selectedStake ? 
    selectedStake.endTime <= BigInt(Math.floor(Date.now() / 1000)) : false;

  // Calculate time remaining
  const timeRemaining = React.useMemo(() => {
    if (!selectedStake || isMatured) return null;
    
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(selectedStake.endTime) - now;
    
    if (remaining <= 0) return null;
    
    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((remaining % (60 * 60)) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, [selectedStake, isMatured]);

  const handleUnstake = async () => {
    if (!selectedStakeId) return;
    
    try {
      setStep('unstake');
      await unstakeTokens(selectedStakeId);
      setStep('success');
    } catch (err) {
      console.error('Unstaking failed:', err);
      setStep('confirm');
    }
  };

  if (!isOpen || !selectedStake) return null;

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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              !isMatured 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}>
              <Unlock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {!isMatured ? 'Early Unstake' : 'Unstake'}
            </h2>
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
              Please connect your wallet to unstake tokens.
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unstaking Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your {Number(formatEther(selectedStake.amount)).toLocaleString()} {token?.symbol} tokens have been unstaked.
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
        ) : (
          <>
            {/* Early Unstake Warning */}
            {!isMatured && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-200">Early Unstaking Warning</p>
                    <p className="text-amber-700 dark:text-amber-300 mt-1">
                      Unstaking before maturity ({new Date(Number(selectedStake.endTime) * 1000).toLocaleDateString()}) may result in reduced rewards or penalties. Consider waiting for maturity to avoid fees.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Unstake Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unstake Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Staked Amount</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Number(formatEther(selectedStake.amount)).toLocaleString()} {token?.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Earned Rewards</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    +{Number(formatEther(selectedStake.rewards)).toLocaleString(undefined, { maximumFractionDigits: 4 })} {token?.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Maturity Date</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(Number(selectedStake.endTime) * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`font-medium text-sm ${
                    isMatured 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {isMatured ? 'Matured' : `${timeRemaining} remaining`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">~0.003 ETH</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">You'll Receive</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {(Number(formatEther(selectedStake.amount)) + Number(formatEther(selectedStake.rewards))).toLocaleString(undefined, { maximumFractionDigits: 4 })} {token?.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm-unstake"
                checked={confirmUnstake}
                onChange={e => setConfirmUnstake(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="confirm-unstake" className="text-sm text-gray-700 dark:text-gray-300">
                I understand that {!isMatured ? 'unstaking early may result in reduced rewards and ' : ''}
                this action cannot be undone. I want to proceed with unstaking.
              </label>
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
                onClick={handleUnstake}
                disabled={!confirmUnstake || isLoading}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  confirmUnstake && !isLoading
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Unstaking...
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5" /> Confirm Unstake
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