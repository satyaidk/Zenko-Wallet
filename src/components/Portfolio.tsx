'use client';

import { useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenBalances } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { TokenList } from './TokenList';
import { PortfolioSummary } from './PortfolioSummary';
import { LoadingSpinner } from './LoadingSpinner';
import { TransactionHistory } from './TransactionHistory';
import { PortfolioCharts } from './PortfolioCharts';
import { ChainSelector } from './ChainSelector';
import { Watchlist } from './Watchlist';
import { CustomTokenManager } from './CustomTokenManager';
import { NFTCollection } from './NFTCollection';
import { Wallet, History, BarChart3, Star, Plus, Image } from 'lucide-react';

export function Portfolio() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { selectedChainId } = useAppStore();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist' | 'nfts' | 'transactions' | 'charts'>('portfolio');
  const [showCustomTokenManager, setShowCustomTokenManager] = useState(false);

  // Memoize tab change handler to prevent infinite re-renders
  const handleTabChange = useCallback((tabId: 'portfolio' | 'watchlist' | 'nfts' | 'transactions' | 'charts') => {
    setActiveTab(tabId);
  }, []);

  // Use selectedChainId from store instead of chainId from wagmi
  const effectiveChainId = selectedChainId || chainId;

  const { data: balances, isLoading, error } = useQuery({
    queryKey: ['tokenBalances', address, effectiveChainId],
    queryFn: () => {
      console.log(`Fetching balances for address: ${address} on chain: ${effectiveChainId}`);
      return fetchTokenBalances(address!, effectiveChainId);
    },
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Portfolio
        </h2>
        <p className="text-red-600">
          Failed to fetch token balances. Please try again later.
        </p>
      </div>
    );
  }

  

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'nfts', label: 'NFTs', icon: Image },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            <PortfolioSummary balances={balances || []} />
            <TokenList balances={balances || []} />
          </div>
        );
      case 'watchlist':
        return <Watchlist />;
      case 'nfts':
        return <NFTCollection />;
      case 'transactions':
        return <TransactionHistory />;
      case 'charts':
        return <PortfolioCharts balances={balances || []} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Chain Selector and Custom Token Button */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <ChainSelector />
          <div className="text-sm text-gray-500 break-all sm:break-normal">
            Connected to: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCustomTokenManager(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Token</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide px-2 sm:px-6" aria-label="Tabs">
            <div className="flex space-x-2 sm:space-x-8 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as 'portfolio' | 'watchlist' | 'nfts' | 'transactions' | 'charts')}
                    className={`
                      flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Custom Token Manager Modal */}
      {showCustomTokenManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CustomTokenManager 
            chainId={effectiveChainId} 
            onClose={() => setShowCustomTokenManager(false)} 
          />
        </div>
      )}
    </div>
  );
}
