'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface PoolData {
  pool: string;
  asset: string;
  apy: string;
  duration: string;
  isPositive?: boolean;
}

interface EcosystemSummaryProps {
  pools?: PoolData[];
}

const defaultPools: PoolData[] = [
  { pool: 'Green Energy Pool', asset: 'GE-Token', apy: '18.5%', duration: '30 Days', isPositive: true },
  { pool: 'Solar Farm Fund', asset: 'SF-Token', apy: '12.2%', duration: '14 Days', isPositive: true },
  { pool: 'Eco Innovate', asset: 'EI-Token', apy: '22.1%', duration: '60 Days', isPositive: true },
  { pool: 'Wind Power Collective', asset: 'WP-Token', apy: '15.8%', duration: '45 Days', isPositive: true },
];

const EcosystemSummary = ({ pools = defaultPools }: EcosystemSummaryProps) => {
  const [assetFilter, setAssetFilter] = useState('all');
  const [apyFilter, setApyFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ecosystem Summary</h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Asset Filter */}
          <div className="relative">
            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="appearance-none bg-gray-600 dark:bg-gray-700 text-white px-4 py-2.5 pr-8 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-500 dark:hover:bg-gray-600 transition-all"
            >
              <option value="all">Filter by Asset</option>
              <option value="ge">GE-Token</option>
              <option value="sf">SF-Token</option>
              <option value="ei">EI-Token</option>
              <option value="wp">WP-Token</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* APY Filter */}
          <div className="relative">
            <select
              value={apyFilter}
              onChange={(e) => setApyFilter(e.target.value)}
              className="appearance-none bg-gray-600 dark:bg-gray-700 text-white px-4 py-2.5 pr-8 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-500 dark:hover:bg-gray-600 transition-all"
            >
              <option value="all">Filter by APY</option>
              <option value="high">High to Low</option>
              <option value="low">Low to High</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Duration Filter */}
          <div className="relative">
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="appearance-none bg-gray-600 dark:bg-gray-700 text-white px-4 py-2.5 pr-8 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-500 dark:hover:bg-gray-600 transition-all"
            >
              <option value="all">Filter by Duration</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="60">60+ Days</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Pool</th>
              <th scope="col" className="px-6 py-3">Asset</th>
              <th scope="col" className="px-6 py-3">APY</th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">Duration</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool, index) => (
              <tr
                key={index}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {pool.pool}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {pool.asset}
                </td>
                <td className={`px-6 py-4 font-semibold ${
                  pool.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {pool.apy}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {pool.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EcosystemSummary;