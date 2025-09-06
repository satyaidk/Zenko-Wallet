'use client';

import { useState } from 'react';
import { useSwitchChain } from 'wagmi';
import { useAppStore, getChainInfo } from '@/lib/store';
import { ChevronDown, Check, Network } from 'lucide-react';

export function ChainSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedChainId, setSelectedChainId } = useAppStore();
  const { switchChain } = useSwitchChain();

  const supportedChains = [
    { id: 1, name: 'Ethereum', symbol: 'ETH' },
    { id: 137, name: 'Polygon', symbol: 'MATIC' },
    { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
    { id: 10, name: 'Optimism', symbol: 'ETH' },
    { id: 8453, name: 'Base', symbol: 'ETH' },
    { id: 56, name: 'BSC', symbol: 'BNB' },
    { id: 43114, name: 'Avalanche', symbol: 'AVAX' },
    { id: 250, name: 'Fantom', symbol: 'FTM' },
    { id: 25, name: 'Cronos', symbol: 'CRO' },
    { id: 1284, name: 'Moonbeam', symbol: 'GLMR' },
    { id: 1285, name: 'Moonriver', symbol: 'MOVR' },
    { id: 1666600000, name: 'Harmony', symbol: 'ONE' },
    { id: 42220, name: 'Celo', symbol: 'CELO' },
    { id: 100, name: 'Gnosis', symbol: 'GNO' },
    { id: 1313161554, name: 'Aurora', symbol: 'ETH' },
    { id: 1088, name: 'Metis', symbol: 'METIS' },
    { id: 1101, name: 'Polygon zkEVM', symbol: 'ETH' },
    { id: 42170, name: 'Arbitrum Nova', symbol: 'ETH' },
  ];

  const currentChain = supportedChains.find(chain => chain.id === selectedChainId) || supportedChains[0];
  const chainInfo = getChainInfo(selectedChainId);

  const handleChainSelect = async (chainId: number) => {
    try {
      setSelectedChainId(chainId);
      if (switchChain) {
        await switchChain({ chainId });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-auto space-x-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 flex-shrink-0" style={{ color: chainInfo.color }} />
          <span className="font-medium text-gray-900 text-sm sm:text-base">{currentChain.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-2">
                Select Network
              </div>
              
              {supportedChains.map((chain) => {
                const chainInfo = getChainInfo(chain.id);
                const isSelected = chain.id === selectedChainId;
                
                return (
                  <button
                    key={chain.id}
                    onClick={() => handleChainSelect(chain.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chainInfo.color }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{chain.name}</div>
                        <div className="text-sm text-gray-500">{chain.symbol}</div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
