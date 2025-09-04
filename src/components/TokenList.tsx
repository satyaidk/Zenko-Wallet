'use client';

import { useState, useMemo } from 'react';
import { TokenBalance } from '@/lib/api';
import { TokenCard } from './TokenCard';

interface TokenListProps {
  balances: TokenBalance[];
}

export function TokenList({ balances }: TokenListProps) {
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'balance'>('value');
  const [filter, setFilter] = useState('');

  const sortedAndFilteredBalances = useMemo(() => {
    const filtered = balances.filter(token =>
      token.contract_name.toLowerCase().includes(filter.toLowerCase()) ||
      token.contract_ticker_symbol.toLowerCase().includes(filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return (b.quote || 0) - (a.quote || 0);
        case 'name':
          return a.contract_name.localeCompare(b.contract_name);
        case 'balance':
          return parseFloat(b.balance) - parseFloat(a.balance);
        default:
          return 0;
      }
    });
  }, [balances, sortBy, filter]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">
          Token Holdings
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search tokens..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'value' | 'name' | 'balance')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="value">Sort by Value</option>
            <option value="name">Sort by Name</option>
            <option value="balance">Sort by Balance</option>
          </select>
        </div>
      </div>

      {sortedAndFilteredBalances.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tokens found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredBalances.map((token, index) => (
            <TokenCard key={`${token.contract_address}-${index}`} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
