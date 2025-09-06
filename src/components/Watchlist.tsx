'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { TokenBalance } from '@/lib/api';
import { Star, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatTokenAmount } from '@/lib/utils';

export function Watchlist() {
  const { watchlist, removeFromWatchlist, selectedChainId } = useAppStore();
  const [watchlistBalances, setWatchlistBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Filter watchlist for current chain - memoized to prevent infinite re-renders
  const currentChainWatchlist = useMemo(() => {
    return watchlist.filter(token => token.chainId === selectedChainId);
  }, [watchlist, selectedChainId]);

  // Fetch balances for watchlist tokens
  useEffect(() => {
    const fetchWatchlistBalances = async () => {
      if (currentChainWatchlist.length === 0) {
        setWatchlistBalances({});
        return;
      }

      setIsLoading(true);
      try {
        // For now, we'll simulate fetching balances for watchlist tokens
        // In a real implementation, you'd need to fetch individual token balances
        const balances: Record<string, TokenBalance> = {};
        
        // This is a simplified approach - in reality you'd need to call the API for each token
        currentChainWatchlist.forEach(token => {
          balances[token.contractAddress] = {
            contract_address: token.contractAddress,
            contract_name: token.name,
            contract_ticker_symbol: token.symbol,
            contract_decimals: 18, // Default, should be fetched
            balance: '0', // Would need to fetch actual balance
            quote: 0,
            quote_rate: 0,
            logo_url: token.logoUrl,
          };
        });

        setWatchlistBalances(balances);
      } catch (error) {
        console.error('Error fetching watchlist balances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistBalances();
  }, [currentChainWatchlist]);

  const handleRemoveFromWatchlist = (tokenId: string) => {
    removeFromWatchlist(tokenId);
  };

  const getPriceChange = (tokenId: string) => {
    // Mock price change - in real implementation, you'd fetch historical data
    // Use tokenId as seed for consistent mock data
    const seed = tokenId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const change = ((seed % 2000) / 100) - 10; // Consistent change between -10% and +10%
    return {
      value: change,
      isPositive: change > 0,
      isNeutral: Math.abs(change) < 0.1,
    };
  };

  if (currentChainWatchlist.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Watchlist Items</h3>
          <p className="text-gray-500 mb-4">
            Add tokens to your watchlist to track their prices and performance.
          </p>
          <p className="text-sm text-gray-400">
            Click the star icon on any token to add it to your watchlist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
          Watchlist ({currentChainWatchlist.length})
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading watchlist...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentChainWatchlist.map((token) => {
            const balance = watchlistBalances[token.contractAddress];
            const priceChange = getPriceChange(token.id);
            
            return (
              <div
                key={token.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-3 sm:space-y-0"
              >
                <div className="flex items-center space-x-3">
                  {token.logoUrl ? (
                    <Image
                      src={token.logoUrl}
                      alt={token.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-gray-600">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{token.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{token.symbol}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                  {/* Price Change */}
                  <div className="text-right min-w-[70px] sm:min-w-[80px]">
                    <div className="flex items-center justify-end space-x-1">
                      {priceChange.isPositive && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />}
                      {!priceChange.isPositive && !priceChange.isNeutral && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />}
                      {priceChange.isNeutral && <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />}
                      <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                        priceChange.isPositive ? 'text-green-600' : 
                        priceChange.isNeutral ? 'text-gray-600' : 'text-red-600'
                      }`}>
                        {priceChange.value > 0 ? '+' : ''}{priceChange.value.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">24h</div>
                  </div>
                  
                  {/* Balance (if available) */}
                  {balance && parseFloat(balance.balance) > 0 && (
                    <div className="text-right hidden sm:block">
                      <div className="font-medium text-gray-900 text-sm">
                        {formatTokenAmount(parseFloat(balance.balance), balance.contract_decimals)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(balance.quote)}
                      </div>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWatchlist(token.id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Remove from watchlist"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
