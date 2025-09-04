'use client';

import { useState } from 'react';
import { TokenCard } from './TokenCard';
import { formatCurrency } from '@/lib/utils';

// Demo data for showcasing the app
const DEMO_TOKENS = [
  {
    contract_address: '0xa0b86a33e6ba0e0e5c4c4b4b4b4b4b4b4b4b4b4b',
    contract_name: 'Ethereum',
    contract_ticker_symbol: 'ETH',
    contract_decimals: 18,
    balance: '2500000000000000000', // 2.5 ETH
    quote: 6250.00,
    quote_rate: 2500.00,
    logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    contract_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    contract_name: 'Dai Stablecoin',
    contract_ticker_symbol: 'DAI',
    contract_decimals: 18,
    balance: '1000000000000000000000', // 1000 DAI
    quote: 1000.00,
    quote_rate: 1.00,
    logo_url: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png'
  },
  {
    contract_address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    contract_name: 'Uniswap',
    contract_ticker_symbol: 'UNI',
    contract_decimals: 18,
    balance: '500000000000000000000', // 500 UNI
    quote: 3750.00,
    quote_rate: 7.50,
    logo_url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  },
  {
    contract_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    contract_name: 'ChainLink Token',
    contract_ticker_symbol: 'LINK',
    contract_decimals: 18,
    balance: '200000000000000000000', // 200 LINK
    quote: 2800.00,
    quote_rate: 14.00,
    logo_url: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  }
];

export function DemoMode() {
  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Demo Mode Available
        </h2>
        <p className="text-blue-600 mb-4">
          Want to see how the app works? Try the demo with sample data.
        </p>
        <button
          onClick={() => setShowDemo(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Demo Portfolio
        </button>
      </div>
    );
  }

  const totalValue = DEMO_TOKENS.reduce((sum, token) => sum + token.quote, 0);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          <strong>Demo Mode:</strong> This is sample data. Connect your wallet to see your real portfolio.
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Portfolio Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(totalValue)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total Portfolio Value
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {DEMO_TOKENS.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Active Tokens
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {DEMO_TOKENS.filter(token => token.quote > 1000).length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              High Value Tokens
            </div>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Token Holdings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_TOKENS.map((token, index) => (
            <TokenCard key={`demo-${index}`} token={token} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowDemo(false)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Hide Demo
        </button>
      </div>
    </div>
  );
}
