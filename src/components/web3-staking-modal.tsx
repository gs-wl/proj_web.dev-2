'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, AlertCircle, CheckCircle, Loader2, ExternalLink, Calendar, Clock, ChevronDown } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useStaking } from '@/hooks/useStaking';
import { SUPPORTED_TOKENS } from '@/lib/web3-config';

interface Web3StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset?: string;
}

const STAKING_PERIODS = [
  { days: 30, label: '1 Month', multiplier: 1.0 },
  { days: 90, label: '3 Months', multiplier: 1.2 },
  { days: 180, label: '6 Months', multiplier: 1.5 },
  { days: 365, label: '12 Months', multiplier: 2.0 },
];

export function Web3StakingModal({ isOpen, onClose, selectedAsset = 'ADA' }: Web3StakingModalProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { 
    useTokenBalance, 
    useTokenAllowance, 
    approveToken, 
    stakeTokens, 
    isLoading, 
    error 
  } = useStaking();

  const [amount, setAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(STAKING_PERIODS[1]); // Default to 3 months
  const [step, setStep] = useState<'input' | 'approve' | 'stake' | 'success'>('input');
  const [txHash, setTxHash] = useState<string>('');

  // Get token info
  const token = SUPPORTED_TOKENS.find(t => t.symbol === selectedAsset);
  const { data: balance } = useTokenBalance(selectedAsset);
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(selectedAsset);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setStep('input');
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

  // Check if approval is needed
  const needsApproval = allowance && amount ? 
    allowance < parseEther(amount) : true;

  // Calculate estimated rewards
  const estimatedRewards = React.useMemo(() => {
    if (!amount || !token) return 0;
    const baseAPY = 0.12; // 12% base APY
    const periodMultiplier = selectedPeriod.multiplier;
    const annualReward = parseFloat(amount) * baseAPY * periodMultiplier;
    return (annualReward * selectedPeriod.days) / 365;
  }, [amount, selectedPeriod, token]);

  const handleApprove = async () => {
    if (!amount || !token) return;
    
    try {
      setStep('approve');
      await approveToken(selectedAsset, amount);
      await refetchAllowance();
      setStep('stake');
    } catch (err) {
      console.error('Approval failed:', err);
      setStep('input');
    }
  };

  const handleStake = async () => {
    if (!amount || !token) return;
    
    try {
      setStep('stake');
      await stakeTokens(selectedAsset, amount, selectedPeriod.days);
      setStep('success');
    } catch (err) {
      console.error('Staking failed:', err);
      setStep('input');
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      // Leave a small amount for gas fees
      const maxAmount = Math.max(0, Number(formatEther(balance)) - 0.01);
      setAmount(maxAmount.toString());
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh] animate-fade-in"
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Stake {selectedAsset}
          </h2>
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
              Please connect your wallet to stake tokens.
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Staking Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your {amount} {selectedAsset} tokens have been staked for {selectedPeriod.label}.
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
            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left side - inputs */}
              <div className="space-y-6">
                {/* Balance Display */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available Balance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {balance ? Number(formatEther(balance)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'} {selectedAsset}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Amount to Stake ({selectedAsset})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleMaxClick}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 text-sm font-medium"
                      disabled={isLoading}
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Staking Period */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Lock-Up Period
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPeriod.label}
                      onChange={(e) => {
                        const period = STAKING_PERIODS.find(p => p.label === e.target.value);
                        if (period) setSelectedPeriod(period);
                      }}
                      className="w-full appearance-none bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                    >
                      {STAKING_PERIODS.map((period) => (
                        <option key={period.days} value={period.label} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                          {period.label} ({period.multiplier}x rewards)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Right side - summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Summary</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Stake Date</span>
                    <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Stake End Date</span>
                    <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {new Date(Date.now() + selectedPeriod.days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Redemption Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{new Date(Date.now() + (selectedPeriod.days + 5) * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Chain</span>
                    <span className="font-medium text-gray-900 dark:text-white">ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Est. APY</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{(12 * selectedPeriod.multiplier).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Est. Interest</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {estimatedRewards.toFixed(4)} {selectedAsset}
                    </span>
                  </div>
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
                disabled={isLoading}
              >
                Cancel Staking
              </button>
              
              {step === 'input' && needsApproval ? (
                <button
                  onClick={handleApprove}
                  disabled={!amount || isLoading || !balance}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Approve {selectedAsset}
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleStake}
                  disabled={!amount || isLoading || !balance || (needsApproval && step !== 'stake')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Staking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Approve Staking
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}