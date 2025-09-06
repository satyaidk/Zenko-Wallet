'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppStore, CustomToken } from '@/lib/store';
import { Plus, X, Trash2, Star, StarOff } from 'lucide-react';

interface CustomTokenManagerProps {
  chainId: number;
  onClose: () => void;
}

export function CustomTokenManager({ chainId, onClose }: CustomTokenManagerProps) {
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [newToken, setNewToken] = useState({
    contractAddress: '',
    name: '',
    symbol: '',
    decimals: 18,
    logoUrl: '',
  });

  const { 
    customTokens, 
    addCustomToken, 
    removeCustomToken,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  } = useAppStore();

  const chainTokens = customTokens.filter(token => token.chainId === chainId);

  const handleAddToken = () => {
    if (!newToken.contractAddress || !newToken.name || !newToken.symbol) {
      alert('Please fill in all required fields');
      return;
    }

    addCustomToken({
      contractAddress: newToken.contractAddress.toLowerCase(),
      name: newToken.name,
      symbol: newToken.symbol.toUpperCase(),
      decimals: newToken.decimals,
      chainId,
      logoUrl: newToken.logoUrl || undefined,
    });

    setNewToken({
      contractAddress: '',
      name: '',
      symbol: '',
      decimals: 18,
      logoUrl: '',
    });
    setIsAddingToken(false);
  };

  const handleRemoveToken = (tokenId: string) => {
    if (confirm('Are you sure you want to remove this custom token?')) {
      removeCustomToken(tokenId);
    }
  };

  const handleToggleWatchlist = (token: CustomToken) => {
    const tokenData = {
      contractAddress: token.contractAddress,
      name: token.name,
      symbol: token.symbol,
      chainId: token.chainId,
      logoUrl: token.logoUrl,
    };

    if (isInWatchlist(token.contractAddress, token.chainId)) {
      const watchlistToken = watchlist.find(
        w => w.contractAddress === token.contractAddress && w.chainId === token.chainId
      );
      if (watchlistToken) {
        removeFromWatchlist(watchlistToken.id);
      }
    } else {
      addToWatchlist(tokenData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Custom Tokens</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Add Token Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => setIsAddingToken(!isAddingToken)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Token</span>
        </button>
      </div>

      {/* Add Token Form */}
      {isAddingToken && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Add New Token</h3>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Address *
              </label>
              <input
                type="text"
                value={newToken.contractAddress}
                onChange={(e) => setNewToken({ ...newToken, contractAddress: e.target.value })}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol *
              </label>
              <input
                type="text"
                value={newToken.symbol}
                onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
                placeholder="USDC"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                placeholder="USD Coin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decimals
              </label>
              <input
                type="number"
                value={newToken.decimals}
                onChange={(e) => setNewToken({ ...newToken, decimals: parseInt(e.target.value) || 18 })}
                min="0"
                max="18"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL (optional)
              </label>
              <input
                type="url"
                value={newToken.logoUrl}
                onChange={(e) => setNewToken({ ...newToken, logoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
            <button
              onClick={handleAddToken}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Add Token
            </button>
            <button
              onClick={() => setIsAddingToken(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Tokens List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Custom Tokens ({chainTokens.length})
        </h3>
        
        {chainTokens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No custom tokens added yet.</p>
            <p className="text-sm">Add tokens that aren&apos;t automatically detected by your wallet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chainTokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {token.logoUrl ? (
                    <Image
                      src={token.logoUrl}
                      alt={token.name}
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
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <div className="font-medium text-gray-900">{token.name}</div>
                    <div className="text-sm text-gray-500">
                      {token.symbol} • {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleWatchlist(token)}
                    className={`p-2 rounded-lg transition-colors ${
                      isInWatchlist(token.contractAddress, token.chainId)
                        ? 'text-yellow-500 hover:bg-yellow-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={isInWatchlist(token.contractAddress, token.chainId) ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    {isInWatchlist(token.contractAddress, token.chainId) ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleRemoveToken(token.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove token"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
