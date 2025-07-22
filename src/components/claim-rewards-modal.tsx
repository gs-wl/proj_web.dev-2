import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, CheckCircle, TrendingUp, Calendar, Coins } from 'lucide-react';

interface ClaimRewardsModalProps {
  onClose?: () => void;
}

const ClaimRewardsModal = ({ onClose = () => {} }: ClaimRewardsModalProps) => {
  const [claimAmount] = useState('12.15');
  const [estimatedGas] = useState('0.0023');
  const [countdown, setCountdown] = useState({ h: 3, m: 45, s: 22 });

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

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

        {/* Reward Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="text-center space-y-2">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Available Rewards</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-300">{claimAmount} ONT</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">≈ $847.32 USD</p>
          </div>
        </div>

        {/* Reward Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reward Details</h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Staking Asset</span>
              <span className="font-medium text-gray-900 dark:text-white">ONT</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Reward Period</span>
              <span className="font-medium text-gray-900 dark:text-white">30 Days</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">APY Rate</span>
              <span className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 25.12%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Next Reward</span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">
                {countdown.h}h {countdown.m}m {countdown.s}s
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
              <span className="font-medium text-gray-900 dark:text-white">{estimatedGas} ETH</span>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
          >
            Cancel
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all">
            <Coins className="w-5 h-5" /> Claim {claimAmount} ONT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardsModal;