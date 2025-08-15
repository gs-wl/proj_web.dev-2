'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface StakingSummaryData {
  totalStaked: string;
  totalRewards: string;
  userAPY: string;
}

interface UserStakingSummaryProps {
  data?: StakingSummaryData;
}

const UserStakingSummary = ({ 
  data = {
    totalStaked: '$50,234.56',
    totalRewards: '$2,109.87',
    userAPY: '15.78%'
  }
}: UserStakingSummaryProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Staking Summary</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Staked</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{data.totalStaked}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Rewards</p>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{data.totalRewards}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your APY</p>
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{data.userAPY}</p>
        </div>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          Manage Stake
        </button>
      </div>
    </div>
  );
};

export default UserStakingSummary;