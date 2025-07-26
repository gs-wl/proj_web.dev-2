'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Lock, Unlock, ArrowRight, Clock, Gift, PlusCircle,
  TrendingUp, DollarSign,
  SortAsc, SortDesc
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { Web3StakingModal } from './web3-staking-modal';
import { Web3ClaimModal } from './web3-claim-modal';
import { Web3UnstakeModal } from './web3-unstake-modal';
import { WalletStatus } from './wallet-status';
import { useStaking } from '@/hooks/useStaking';
import { SUPPORTED_TOKENS } from '@/lib/web3-config';

const stakingOffers = [
  { asset: 'RWA', apy: 15.25, min: 50, logo: '/rwa.svg', color: 'from-green-500 to-emerald-600', status: 'active' },
  { asset: 'REAL', apy: 12.80, min: 1000, logo: '/real-estate.svg', color: 'from-blue-500 to-blue-600', status: 'active' },
  { asset: 'GOLD', apy: 8.45, min: 100, logo: '/gold.svg', color: 'from-yellow-500 to-orange-600', status: 'active' },
  { asset: 'BOND', apy: 6.75, min: 500, logo: '/bonds.svg', color: 'from-purple-500 to-purple-600', status: 'active' },
  { asset: 'ART', apy: 18.90, min: 250, logo: '/art.svg', color: 'from-pink-500 to-pink-600', status: 'inactive' },
];

const userStakes = [
  { 
    asset: 'REAL', 
    amount: 300025.45, 
    period: '6 Month', 
    reward: 400025.015, 
    endDate: '2024-08-15',
    status: 'active',
    startDate: '2024-02-15',
    earned: 12500.75
  },
  { 
    asset: 'RWA', 
    amount: 150000.00, 
    period: '3 Month', 
    reward: 200000.00, 
    endDate: '2024-06-20',
    status: 'completed',
    startDate: '2024-03-20',
    earned: 8750.25
  },
  { 
    asset: 'GOLD', 
    amount: 5000.00, 
    period: '12 Month', 
    reward: 8500.00, 
    endDate: '2025-01-10',
    status: 'active',
    startDate: '2024-01-10',
    earned: 2100.50
  },
];

const userRewards = [
  {
    asset: 'REAL',
    availableRewards: 12.15,
    totalEarned: 125.75,
    apy: 12.80,
    lastClaimed: '2024-03-15',
    nextClaimDate: '2024-04-15',
    stakingPeriod: '6 Month',
    status: 'claimable',
    usdValue: 847.32,
    logo: '/real-estate.svg',
    color: 'from-blue-500 to-blue-600'
  },
  {
    asset: 'RWA',
    availableRewards: 45.82,
    totalEarned: 287.50,
    apy: 15.25,
    lastClaimed: '2024-03-10',
    nextClaimDate: '2024-04-10',
    stakingPeriod: '3 Month',
    status: 'claimable',
    usdValue: 1205.75,
    logo: '/rwa.svg',
    color: 'from-green-500 to-emerald-600'
  },
  {
    asset: 'GOLD',
    availableRewards: 2.35,
    totalEarned: 18.90,
    apy: 8.45,
    lastClaimed: '2024-03-20',
    nextClaimDate: '2024-04-20',
    stakingPeriod: '12 Month',
    status: 'claimable',
    usdValue: 425.60,
    logo: '/gold.svg',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    asset: 'BOND',
    availableRewards: 0.00,
    totalEarned: 156.25,
    apy: 6.75,
    lastClaimed: '2024-03-25',
    nextClaimDate: '2024-04-25',
    stakingPeriod: '6 Month',
    status: 'pending',
    usdValue: 0.00,
    logo: '/bonds.svg',
    color: 'from-purple-500 to-purple-600'
  },
  {
    asset: 'ART',
    availableRewards: 8.75,
    totalEarned: 92.40,
    apy: 18.90,
    lastClaimed: '2024-03-12',
    nextClaimDate: '2024-04-12',
    stakingPeriod: '9 Month',
    status: 'claimable',
    usdValue: 312.85,
    logo: '/art.svg',
    color: 'from-pink-500 to-pink-600'
  }
];

const StakingPage = () => {
  const { isConnected } = useAccount();
  const { userStakes } = useStaking();
  const [tab, setTab] = useState('offerings'); // offerings | my-stakes | rewards
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('RWA');
  const [selectedStakeId, setSelectedStakeId] = useState<bigint | undefined>(undefined);
  
  // Sorting and filtering states
  const [offeringSortBy, setOfferingSortBy] = useState('apy'); // apy | asset | min
  const [offeringSortOrder, setOfferingSortOrder] = useState<'asc' | 'desc'>('desc');
  const [offeringStatusFilter, setOfferingStatusFilter] = useState('all'); // all | active | inactive
  
  const [stakesSortBy, setStakesSortBy] = useState('amount'); // amount | earned | endDate | asset
  const [stakesSortOrder, setStakesSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stakesStatusFilter, setStakesStatusFilter] = useState('all'); // all | active | completed
  
  // Rewards sorting and filtering states
  const [rewardsSortBy, setRewardsSortBy] = useState('availableRewards'); // availableRewards | totalEarned | apy | asset | usdValue
  const [rewardsSortOrder, setRewardsSortOrder] = useState<'asc' | 'desc'>('desc');
  const [rewardsStatusFilter, setRewardsStatusFilter] = useState('all'); // all | claimable | pending
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]); // For bulk claiming
  const [showStakedDropdown, setShowStakedDropdown] = useState(false); // For total staked dropdown
  const stakedDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stakedDropdownRef.current && !stakedDropdownRef.current.contains(event.target as Node)) {
        setShowStakedDropdown(false);
      }
    };

    if (showStakedDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStakedDropdown]);

  // Calculate staked amounts by asset (for future use)
  // const stakedByAsset = useMemo(() => {
  //   if (!userStakes) {
  //     return [];
  //   }
  //   
  //   const assetMap = new Map<string, number>();
  //   userStakes.forEach(stake => {
  //     // Find the token symbol from the contract address
  //     const token = SUPPORTED_TOKENS.find(t => 
  //       Object.values(t.addresses).includes(stake.token as `0x${string}`)
  //     );
  //     const asset = token?.symbol || 'Unknown';
  //     const currentAmount = assetMap.get(asset) || 0;
  //     assetMap.set(asset, currentAmount + Number(stake.amount) / 1e18); // Convert from wei
  //   });
  //   return Array.from(assetMap.entries()).map(([asset, amount]) => ({
  //     asset,
  //     amount,
  //     logo: stakingOffers.find(offer => offer.asset === asset)?.logo || '',
  //     color: stakingOffers.find(offer => offer.asset === asset)?.color || 'from-gray-500 to-gray-600'
  //   })).sort((a, b) => b.amount - a.amount);
  // }, [userStakes]);

  // Memoized sorted and filtered offerings
  const sortedOfferings = useMemo(() => {
    let filtered = stakingOffers;
    
    // Apply status filter
    if (offeringStatusFilter !== 'all') {
      filtered = filtered.filter(offer => offer.status === offeringStatusFilter);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (offeringSortBy) {
        case 'apy':
          aValue = a.apy;
          bValue = b.apy;
          break;
        case 'asset':
          aValue = a.asset;
          bValue = b.asset;
          break;
        case 'min':
          aValue = a.min;
          bValue = b.min;
          break;
        default:
          aValue = a.apy;
          bValue = b.apy;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return offeringSortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return offeringSortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [offeringSortBy, offeringSortOrder, offeringStatusFilter]);

  // Memoized sorted and filtered stakes
  const sortedStakes = useMemo(() => {
    if (!userStakes) {
      return [];
    }
    
    let filtered = userStakes;
    
    // Apply status filter
    if (stakesStatusFilter !== 'all') {
      filtered = filtered.filter(stake => {
        const isMatured = stake.endTime <= BigInt(Math.floor(Date.now() / 1000));
        const status = isMatured ? 'completed' : 'active';
        return status === stakesStatusFilter;
      });
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: number | string | Date;
      let bValue: number | string | Date;
      
      switch (stakesSortBy) {
        case 'amount': {
          aValue = Number(a.amount);
          bValue = Number(b.amount);
          break;
        }
        case 'earned': {
          aValue = Number(a.rewards);
          bValue = Number(b.rewards);
          break;
        }
        case 'endDate':
          aValue = new Date(Number(a.endTime) * 1000);
          bValue = new Date(Number(b.endTime) * 1000);
          break;
        case 'asset': {
          const tokenA = SUPPORTED_TOKENS.find(t => 
            Object.values(t.addresses).includes(a.token as `0x${string}`)
          );
          const tokenB = SUPPORTED_TOKENS.find(t => 
            Object.values(t.addresses).includes(b.token as `0x${string}`)
          );
          aValue = tokenA?.symbol || 'Unknown';
          bValue = tokenB?.symbol || 'Unknown';
          break;
        }
        default:
          aValue = Number(a.amount);
          bValue = Number(b.amount);
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return stakesSortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return stakesSortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return stakesSortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [userStakes, stakesSortBy, stakesSortOrder, stakesStatusFilter]);

  // Memoized sorted and filtered rewards
  const sortedRewards = useMemo(() => {
    let filtered = userRewards;
    
    // Apply status filter
    if (rewardsStatusFilter !== 'all') {
      filtered = filtered.filter(reward => reward.status === rewardsStatusFilter);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: number | string | Date;
      let bValue: number | string | Date;
      
      switch (rewardsSortBy) {
        case 'availableRewards':
          aValue = a.availableRewards;
          bValue = b.availableRewards;
          break;
        case 'totalEarned':
          aValue = a.totalEarned;
          bValue = b.totalEarned;
          break;
        case 'apy':
          aValue = a.apy;
          bValue = b.apy;
          break;
        case 'asset':
          aValue = a.asset;
          bValue = b.asset;
          break;
        case 'usdValue':
          aValue = a.usdValue;
          bValue = b.usdValue;
          break;
        default:
          aValue = a.availableRewards;
          bValue = b.availableRewards;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return rewardsSortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return rewardsSortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [rewardsSortBy, rewardsSortOrder, rewardsStatusFilter]);

  // Calculate total token balance for header display
  const totalTokenBalance = useMemo(() => {
    if (!userStakes) {
      return 0;
    }
    return userStakes.reduce((total, stake) => {
      return total + Number(stake.amount) / 1e18; // Convert from wei
    }, 0);
  }, [userStakes]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ---- Header ---- */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Staking</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {isConnected && (
            <>
              {/* Token Balance Card */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm min-w-[160px]">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Token Balance</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                      {totalTokenBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Add Stake Button */}
              <button 
                onClick={() => setShowStakingModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all min-h-[40px]"
              >
                <PlusCircle className="w-4 h-4" /> Add Stake
              </button>
            </>
          )}
        </div>
      </header>

      {/* ---- Wallet Status ---- */}
      <WalletStatus />

      {/* ---- Connection Prompt (when not connected) ---- */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connect Your Wallet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect your wallet using the button in the top-right corner to start staking and earning rewards.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Look for the wallet button</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* ---- Tabs ---- */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'offerings', label: 'Staking Offerings' },
            { id: 'my-stakes', label: 'My Stakes' },
            { id: 'rewards', label: 'Rewards' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${tab === t.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ---- Dynamic Sections ---- */}
      {tab === 'offerings' && (
        <OfferingGrid 
          offerings={sortedOfferings}
          onStakeClick={(asset) => {
            setSelectedAsset(asset);
            setShowStakingModal(true);
          }}
          sortBy={offeringSortBy}
          sortOrder={offeringSortOrder}
          statusFilter={offeringStatusFilter}
          onSortChange={(field) => {
            if (field === offeringSortBy) {
              setOfferingSortOrder(offeringSortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setOfferingSortBy(field);
              setOfferingSortOrder('desc');
            }
          }}
          onStatusFilterChange={setOfferingStatusFilter}
        />
      )}
      {tab === 'my-stakes' && (
        <MyStakesTable 
          stakes={sortedStakes}
          onUnstakeClick={(stake) => {
            // Extract ID from stake item for Web3 stakes, or use a mock ID for mock data
            const stakeId = stake.id || BigInt(0);
            setSelectedStakeId(stakeId);
            setShowUnstakeModal(true);
          }}
          sortBy={stakesSortBy}
          sortOrder={stakesSortOrder}
          statusFilter={stakesStatusFilter}
          onSortChange={(field) => {
            if (field === stakesSortBy) {
              setStakesSortOrder(stakesSortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setStakesSortBy(field);
              setStakesSortOrder('desc');
            }
          }}
          onStatusFilterChange={setStakesStatusFilter}
        />
      )}
      {tab === 'rewards' && (
        <RewardsTable
          rewards={sortedRewards}
          selectedRewards={selectedRewards}
          onRewardSelect={setSelectedRewards}
          onClaimClick={() => {
            setShowClaimModal(true);
          }}
          sortBy={rewardsSortBy}
          sortOrder={rewardsSortOrder}
          statusFilter={rewardsStatusFilter}
          onSortChange={(field) => {
            if (field === rewardsSortBy) {
              setRewardsSortOrder(rewardsSortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setRewardsSortBy(field);
              setRewardsSortOrder('desc');
            }
          }}
          onStatusFilterChange={setRewardsStatusFilter}
        />
      )}

      {/* ---- Modals ---- */}
      <Web3StakingModal
        isOpen={showStakingModal}
        onClose={() => setShowStakingModal(false)}
        selectedAsset={selectedAsset}
      />
      
      <Web3ClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
      />
      
      <Web3UnstakeModal
        isOpen={showUnstakeModal}
        onClose={() => {
          setShowUnstakeModal(false);
          setSelectedStakeId(undefined);
        }}
        selectedStakeId={selectedStakeId}
      />
    </div>
  );
};

/* ---------------------------------- */
interface OfferingGridProps {
  offerings: typeof stakingOffers;
  onStakeClick: (asset: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  statusFilter: string;
  onSortChange: (field: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const OfferingGrid = ({ 
  offerings, 
  onStakeClick, 
  sortBy, 
  sortOrder, 
  statusFilter, 
  onSortChange, 
  onStatusFilterChange 
}: OfferingGridProps) => (
  <div className="space-y-6">
    {/* Sorting and Filtering Controls */}
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Filter:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all" className="text-gray-900 dark:text-white">All Status</option>
          <option value="active" className="text-gray-900 dark:text-white">Active</option>
          <option value="inactive" className="text-gray-900 dark:text-white">Inactive</option>
        </select>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Sort by:</span>
        {[
          { key: 'apy', label: 'APY' },
          { key: 'asset', label: 'Asset' },
          { key: 'min', label: 'Min Stake' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
            {sortBy === key && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Results Count */}
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Showing {offerings.length} of {stakingOffers.length} staking offers
    </div>

    {/* Offerings Grid */}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {offerings.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No staking offers match your current filters.</p>
        </div>
      ) : (
        offerings.map(o => (
          <div key={o.asset} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 space-y-4 relative border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600">
            {/* Status Indicator */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              o.status === 'active' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
            }`}>
              {o.status === 'active' ? '🟢 Active' : '⚫ Inactive'}
            </div>
            
            {/* Header with Asset Info */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-800">
                <Image 
                  src={o.logo} 
                  alt={o.asset} 
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient circle if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = `w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${o.color} flex items-center justify-center text-white font-bold text-sm sm:text-base ring-2 ring-blue-100 dark:ring-blue-800`;
                      parent.textContent = o.asset.slice(0, 2);
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">{o.asset}</p>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">🔒 Locked Staking</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Duration: 30-365 days</p>
              </div>
            </div>

            {/* APY Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Annual Percentage Yield</span>
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {o.apy}%
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">Min. Stake</span>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{o.min} {o.asset}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">Total Staked</span>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{(Math.random() * 1000000).toFixed(0)} {o.asset}</p>
              </div>
            </div>

            {/* Participants Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                👥 {Math.floor(Math.random() * 500) + 100} participants
              </span>
              <span className="flex items-center gap-1">
                ⏱️ {Math.floor(Math.random() * 20) + 5} days left
              </span>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => onStakeClick(o.asset)}
              className={`w-full py-3 rounded-lg font-semibold transition-all text-sm sm:text-base shadow-md hover:shadow-lg ${
                o.status === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              disabled={o.status !== 'active'}
            >
              {o.status === 'active' ? '🚀 Stake Now' : '❌ Unavailable'}
            </button>
          </div>
        ))
      )}
    </section>
  </div>
);

/* ---------------------------------- */
// Union type to handle both mock data and real Web3 data
type StakeItem = {
  asset?: string;
  amount: number | bigint;
  period?: string;
  reward?: number;
  endDate?: string;
  status?: string;
  startDate?: string;
  earned?: number;
  id?: bigint;
  token?: string;
  rewards?: bigint;
  startTime?: bigint;
  endTime?: bigint;
  claimed?: boolean;
};

interface MyStakesTableProps {
  stakes: StakeItem[];
  onUnstakeClick: (stake: StakeItem) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  statusFilter: string;
  onSortChange: (field: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const MyStakesTable = ({ 
  stakes, 
  onUnstakeClick, 
  sortBy, 
  sortOrder, 
  statusFilter, 
  onSortChange, 
  onStatusFilterChange 
}: MyStakesTableProps) => (
  <div className="space-y-6">
    {/* Sorting and Filtering Controls */}
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Filter:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all" className="text-gray-900 dark:text-white">All Status</option>
          <option value="active" className="text-gray-900 dark:text-white">Active</option>
          <option value="completed" className="text-gray-900 dark:text-white">Completed</option>
        </select>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Sort by:</span>
        {[
          { key: 'amount', label: 'Amount' },
          { key: 'earned', label: 'Earned' },
          { key: 'endDate', label: 'End Date' },
          { key: 'asset', label: 'Asset' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
            {sortBy === key && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Results Count */}
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Showing {stakes.length} of {userStakes.length} stakes
    </div>

    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {stakes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No stakes match your current filters.</p>
        </div>
      ) : (
        <>
          {/* Mobile view */}
          <div className="block sm:hidden">
            {stakes.map(s => (
              <div key={`${s.asset}-${s.startDate}`} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{s.asset}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {s.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{s.period}</p>
                  </div>
                  <button 
                    onClick={() => onUnstakeClick(s)}
                    className={`font-semibold text-sm ${
                      s.status === 'active'
                        ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={s.status !== 'active'}
                  >
                    <Unlock className="inline w-4 h-4 mr-1" /> 
                    {s.status === 'active' ? 'Unstake' : 'Completed'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Amount</span>
                    <p className="font-medium">{s.amount.toLocaleString()} {s.asset}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Earned</span>
                    <p className="font-medium text-green-600 dark:text-green-400">{(s.earned || 0).toLocaleString()} {s.asset}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Reward</span>
                    <p className="font-medium">{(s.reward || 0).toLocaleString()} {s.asset}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">End Date</span>
                    <p className="font-medium">{s.endDate}</p>
                  </div>
                </div>
              </div>
      ))}
    </div>

    {/* Desktop view */}
    <div className="hidden sm:block">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earned</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {stakes.map(s => (
            <tr key={`${s.asset}-${s.startDate}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{s.asset}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{s.amount.toLocaleString()} {s.asset}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">{(s.earned || 0).toLocaleString()} {s.asset}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{s.period}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{s.endDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  s.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {s.status === 'active' ? 'Active' : 'Completed'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  onClick={() => onUnstakeClick(s)}
                  className={`font-semibold ${
                    s.status === 'active'
                      ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={s.status !== 'active'}
                >
                  <Unlock className="inline w-4 h-4 mr-1" /> 
                  {s.status === 'active' ? 'Unstake' : 'Completed'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
      )}
    </section>
  </div>
);

/* ---------------------------------- */
interface RewardsTableProps {
  rewards: typeof userRewards;
  selectedRewards: string[];
  onRewardSelect: (rewards: string[]) => void;
  onClaimClick: (rewards: string[]) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  statusFilter: string;
  onSortChange: (field: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const RewardsTable = ({ 
  rewards, 
  selectedRewards,
  onRewardSelect,
  onClaimClick, 
  sortBy, 
  sortOrder, 
  statusFilter, 
  onSortChange, 
  onStatusFilterChange 
}: RewardsTableProps) => {
  const claimableRewards = rewards.filter(r => r.status === 'claimable');
  const totalClaimableValue = claimableRewards.reduce((total, reward) => total + reward.usdValue, 0);
  
  const handleSelectAll = () => {
    if (selectedRewards.length === claimableRewards.length) {
      onRewardSelect([]);
    } else {
      onRewardSelect(claimableRewards.map(r => r.asset));
    }
  };

  const handleSelectReward = (asset: string) => {
    if (selectedRewards.includes(asset)) {
      onRewardSelect(selectedRewards.filter(r => r !== asset));
    } else {
      onRewardSelect([...selectedRewards, asset]);
    }
  };

  const handleClaimSelected = () => {
    if (selectedRewards.length > 0) {
      onClaimClick(selectedRewards);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Claimable</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalClaimableValue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {claimableRewards.length} tokens available
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${rewards.reduce((total, reward) => total + (reward.totalEarned * (reward.usdValue / reward.availableRewards || 0)), 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All time rewards
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Reinvested</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${rewards.reduce((total, reward) => total + (reward.totalEarned * 0.15 * (reward.usdValue / reward.availableRewards || 0)), 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            You reinvested
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all" className="text-gray-900 dark:text-white">All Status</option>
            <option value="claimable" className="text-gray-900 dark:text-white">Claimable</option>
            <option value="pending" className="text-gray-900 dark:text-white">Pending</option>
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Sort by:</span>
          {[
            { key: 'availableRewards', label: 'Available' },
            { key: 'totalEarned', label: 'Total Earned' },
            { key: 'apy', label: 'APY' },
            { key: 'asset', label: 'Asset' },
            { key: 'usdValue', label: 'USD Value' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onSortChange(key)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
              {sortBy === key && (
                sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {claimableRewards.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedRewards.length === claimableRewards.length && claimableRewards.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedRewards.length > 0 
                ? `${selectedRewards.length} selected` 
                : 'Select all claimable rewards'
              }
            </span>
          </div>
          
          {selectedRewards.length > 0 && (
            <button
              onClick={handleClaimSelected}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              <Gift className="w-4 h-4" />
              Claim Selected (${rewards.filter(r => selectedRewards.includes(r.asset)).reduce((total, reward) => total + reward.usdValue, 0).toLocaleString()})
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {rewards.length} of {userRewards.length} rewards
      </div>

      {/* Rewards Table */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {rewards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No rewards match your current filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="block lg:hidden">
              {rewards.map(reward => (
                <div key={reward.asset} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {reward.status === 'claimable' && (
                        <input
                          type="checkbox"
                          checked={selectedRewards.includes(reward.asset)}
                          onChange={() => handleSelectReward(reward.asset)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${reward.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{reward.asset.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{reward.asset}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reward.status === 'claimable' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {reward.status === 'claimable' ? 'Claimable' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    {reward.status === 'claimable' && (
                      <button 
                        onClick={() => onClaimClick([reward.asset])}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 font-semibold text-sm"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Available</span>
                      <p className="font-medium">{reward.availableRewards.toLocaleString()} {reward.asset}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">USD Value</span>
                      <p className="font-medium text-green-600 dark:text-green-400">${reward.usdValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Earned</span>
                      <p className="font-medium">{reward.totalEarned.toLocaleString()} {reward.asset}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">APY</span>
                      <p className="font-medium">{reward.apy}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedRewards.length === claimableRewards.length && claimableRewards.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Rewards</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rewards.map(reward => (
                    <tr key={reward.asset} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reward.status === 'claimable' && (
                          <input
                            type="checkbox"
                            checked={selectedRewards.includes(reward.asset)}
                            onChange={() => handleSelectReward(reward.asset)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${reward.color} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{reward.asset.slice(0, 2)}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{reward.asset}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {reward.availableRewards.toLocaleString()} {reward.asset}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                        ${reward.usdValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {reward.totalEarned.toLocaleString()} {reward.asset}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {reward.apy}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reward.status === 'claimable' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {reward.status === 'claimable' ? 'Claimable' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reward.status === 'claimable' ? (
                          <button 
                            onClick={() => onClaimClick([reward.asset])}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 font-semibold"
                          >
                            <Gift className="inline w-4 h-4 mr-1" /> Claim
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            <Clock className="inline w-4 h-4 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default StakingPage;