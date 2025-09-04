'use client';

import { useMemo } from 'react';
import { TokenBalance } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface PortfolioSummaryProps {
  balances: TokenBalance[];
}

export function PortfolioSummary({ balances }: PortfolioSummaryProps) {
  const totalValue = useMemo(() => {
    return balances.reduce((total, token) => {
      return total + (token.quote || 0);
    }, 0);
  }, [balances]);

  const tokenCount = balances.length;

  return (
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
            {tokenCount}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Active Tokens
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {balances.filter(token => token.quote && token.quote > 1000).length}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            High Value Tokens
          </div>
        </div>
      </div>
    </div>
  );
}
