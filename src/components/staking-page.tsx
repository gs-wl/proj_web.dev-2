import React, { useState, useMemo } from 'react';
import {
  Lock, Unlock, ArrowRight, Clock, Gift, PlusCircle, Repeat,
  ChevronDown, TrendingUp, DollarSign, Calendar, Settings, Bell, User,
  Filter, SortAsc, SortDesc
} from 'lucide-react';
import StakingActivationModal from './staking-activation-modal';
import ClaimRewardsModal from './claim-rewards-modal';
import UnstakeModal from './unstake-modal';

const stakingOffers = [
  { asset: 'ADA', apy: 8.65, min: 100, logo: '/ada.svg', color: 'from-blue-500 to-blue-600', status: 'active' },
  { asset: 'ONT', apy: 7.46, min: 100, logo: '/ont.svg', color: 'from-green-500 to-green-600', status: 'active' },
  { asset: 'SOL', apy: 12.66, min: 8, logo: '/sol.svg', color: 'from-purple-500 to-purple-600', status: 'active' },
  { asset: 'DOT', apy: 24.5, min: 5, logo: '/dot.svg', color: 'from-pink-500 to-pink-600', status: 'inactive' },
  { asset: 'XRP', apy: 15.47, min: 10, logo: '/xrp.svg', color: 'from-indigo-500 to-indigo-600', status: 'active' },
];

const userStakes = [
  { 
    asset: 'ONT', 
    amount: 300025.45, 
    period: '6 Month', 
    reward: 400025.015, 
    endDate: '2024-08-15',
    status: 'active',
    startDate: '2024-02-15',
    earned: 12500.75
  },
  { 
    asset: 'ADA', 
    amount: 150000.00, 
    period: '3 Month', 
    reward: 200000.00, 
    endDate: '2024-06-20',
    status: 'completed',
    startDate: '2024-03-20',
    earned: 8750.25
  },
  { 
    asset: 'SOL', 
    amount: 5000.00, 
    period: '12 Month', 
    reward: 8500.00, 
    endDate: '2025-01-10',
    status: 'active',
    startDate: '2024-01-10',
    earned: 2100.50
  },
];

const StakingPage = () => {
  const [tab, setTab] = useState('offerings'); // offerings | my-stakes | rewards
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [selectedStake, setSelectedStake] = useState<typeof userStakes[0] | null>(null);
  
  // Sorting and filtering states
  const [offeringSortBy, setOfferingSortBy] = useState('apy'); // apy | asset | min
  const [offeringSortOrder, setOfferingSortOrder] = useState<'asc' | 'desc'>('desc');
  const [offeringStatusFilter, setOfferingStatusFilter] = useState('all'); // all | active | inactive
  
  const [stakesSortBy, setStakesSortBy] = useState('amount'); // amount | earned | endDate | asset
  const [stakesSortOrder, setStakesSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stakesStatusFilter, setStakesStatusFilter] = useState('all'); // all | active | completed

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
    let filtered = userStakes;
    
    // Apply status filter
    if (stakesStatusFilter !== 'all') {
      filtered = filtered.filter(stake => stake.status === stakesStatusFilter);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: number | string | Date;
      let bValue: number | string | Date;
      
      switch (stakesSortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'earned':
          aValue = a.earned;
          bValue = b.earned;
          break;
        case 'endDate':
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          break;
        case 'asset':
          aValue = a.asset;
          bValue = b.asset;
          break;
        default:
          aValue = a.amount;
          bValue = b.amount;
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
  }, [stakesSortBy, stakesSortOrder, stakesStatusFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ---- Header ---- */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Staking</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowStakingModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Stake
          </button>
        </div>
      </header>

      {/* ---- Wallet Snapshot ---- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: 'Available Balance', value: '68,750,904.45 USDT', icon: DollarSign },
          { label: 'Total Staked', value: '300,025.45 ONT', icon: Lock },
          { label: 'Rewards to Claim', value: '12.15 ONT', icon: Gift },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </section>

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
          onStakeClick={() => setShowStakingModal(true)}
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
            setSelectedStake(stake);
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
      {tab === 'rewards' && <RewardsCenter onClaimClick={() => setShowClaimModal(true)} />}

      {/* ---- Modals ---- */}
      {showStakingModal && (
        <StakingActivationModal onClose={() => setShowStakingModal(false)} />
      )}
      
      {showClaimModal && (
        <ClaimRewardsModal onClose={() => setShowClaimModal(false)} />
      )}
      
      {showUnstakeModal && selectedStake && (
        <UnstakeModal 
          onClose={() => {
            setShowUnstakeModal(false);
            setSelectedStake(null);
          }}
          stakeData={selectedStake}
        />
      )}
    </div>
  );
};

/* ---------------------------------- */
interface OfferingGridProps {
  offerings: typeof stakingOffers;
  onStakeClick: () => void;
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
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
          <div key={o.asset} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 space-y-4 relative">
            {/* Status Indicator */}
            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
              o.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
            }`}>
              {o.status === 'active' ? 'Active' : 'Inactive'}
            </div>
            
            <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
            <img 
              src={o.logo} 
              alt={o.asset} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient circle if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = `w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${o.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm`;
                  parent.textContent = o.asset.slice(0, 2);
                }
              }}
            />
          </div>
          <div>
            <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">{o.asset}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Locked Staking</p>
          </div>
        </div>
        <div>
          <span className="text-xs sm:text-sm text-gray-500">APY</span>
          <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> {o.apy}%
          </p>
        </div>
        <div>
          <span className="text-xs sm:text-sm text-gray-500">Min. Stake</span>
          <p className="font-semibold text-sm sm:text-base">{o.min} {o.asset}</p>
        </div>
            <button 
              onClick={onStakeClick}
              className={`w-full py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                o.status === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              disabled={o.status !== 'active'}
            >
              {o.status === 'active' ? 'Stake Now' : 'Unavailable'}
            </button>
          </div>
        ))
      )}
    </section>
  </div>
);

/* ---------------------------------- */
interface MyStakesTableProps {
  stakes: typeof userStakes;
  onUnstakeClick: (stake: typeof userStakes[0]) => void;
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
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
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
                    <p className="font-medium text-green-600 dark:text-green-400">{s.earned.toLocaleString()} {s.asset}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Reward</span>
                    <p className="font-medium">{s.reward.toLocaleString()} {s.asset}</p>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">{s.earned.toLocaleString()} {s.asset}</td>
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
interface RewardsCenterProps {
  onClaimClick: () => void;
}

const RewardsCenter = ({ onClaimClick }: RewardsCenterProps) => {
  const [countdown, setCountdown] = React.useState({ d: 3, h: 4, m: 15 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.m > 0) return { ...prev, m: prev.m - 1 };
        if (prev.h > 0) return { d: prev.d, h: prev.h - 1, m: 59 };
        if (prev.d > 0) return { d: prev.d - 1, h: 23, m: 59 };
        return { d: 0, h: 0, m: 0 };
      });
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Gift className="text-green-500 w-5 h-5" /> Rewards to Claim
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">12.15 ONT</p>
        <p className="text-xs sm:text-sm text-gray-500">
          Next claim in: <span className="font-mono">{countdown.d}D {countdown.h}H {countdown.m}Min</span>
        </p>
        <button 
          onClick={onClaimClick}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 text-sm sm:text-base"
        >
          Claim Now
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="text-blue-500 w-5 h-5" /> Auto-Claim
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">Enable automatic reward compounding to maximize APY.</p>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          <span className="ml-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Activate Auto-Claim</span>
        </label>
      </div>
    </section>
  );
};

export default StakingPage;