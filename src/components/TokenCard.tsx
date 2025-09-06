'use client';

import Image from 'next/image';
import { useChainId } from 'wagmi';
import { TokenBalance, isStablecoin, getStablecoinSymbol } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatTokenAmount } from '@/lib/utils';
import { Star, StarOff, DollarSign } from 'lucide-react';

interface TokenCardProps {
  token: TokenBalance;
}

export function TokenCard({ token }: TokenCardProps) {
  const chainId = useChainId();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  
  const balance = parseFloat(token.balance);
  const formattedBalance = formatTokenAmount(balance, token.contract_decimals);
  const value = token.quote || 0;
  const price = token.quote_rate || 0;
  
  const isStable = isStablecoin(token.contract_address, chainId);
  const stablecoinSymbol = getStablecoinSymbol(token.contract_address, chainId);
  const inWatchlist = isInWatchlist(token.contract_address, chainId);

  const handleToggleWatchlist = () => {
    const tokenData = {
      contractAddress: token.contract_address,
      name: token.contract_name,
      symbol: token.contract_ticker_symbol,
      chainId: chainId,
      logoUrl: token.logo_url,
    };

    if (inWatchlist) {
      const watchlistToken = useAppStore.getState().watchlist.find(
        w => w.contractAddress === token.contract_address && w.chainId === chainId
      );
      if (watchlistToken) {
        removeFromWatchlist(watchlistToken.id);
      }
    } else {
      addToWatchlist(tokenData);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors relative">
      {/* Watchlist Button */}
      <button
        onClick={handleToggleWatchlist}
        className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
          inWatchlist
            ? 'text-yellow-500 hover:bg-yellow-50'
            : 'text-gray-400 hover:bg-gray-200'
        }`}
        title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {inWatchlist ? (
          <Star className="w-4 h-4 fill-current" />
        ) : (
          <StarOff className="w-4 h-4" />
        )}
      </button>

      {/* Stablecoin Indicator */}
      {isStable && (
        <div className="absolute top-3 left-3 p-1.5 bg-green-100 rounded-full">
          <DollarSign className="w-3 h-3 text-green-600" />
        </div>
      )}

      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 pr-8">
        {token.logo_url ? (
          <Image
            src={token.logo_url}
            alt={token.contract_name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">
              {token.contract_ticker_symbol.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
            {token.contract_name}
          </h3>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <p className="text-xs sm:text-sm text-gray-500">
              {token.contract_ticker_symbol}
            </p>
            {isStable && stablecoinSymbol && (
              <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                {stablecoinSymbol}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Balance:</span>
          <span className="font-medium text-gray-900 text-xs sm:text-sm">
            {formattedBalance}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Price:</span>
          <span className="font-medium text-gray-900 text-xs sm:text-sm">
            {formatCurrency(price)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-gray-200">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Value:</span>
          <span className="font-bold text-green-600 text-xs sm:text-sm">
            {formatCurrency(value)}
          </span>
        </div>
      </div>
    </div>
  );
}
