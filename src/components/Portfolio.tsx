'use client';

import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenBalances } from '@/lib/api';
import { TokenList } from './TokenList';
import { PortfolioSummary } from './PortfolioSummary';
import { LoadingSpinner } from './LoadingSpinner';

export function Portfolio() {
  const { address } = useAccount();

  const { data: balances, isLoading, error } = useQuery({
    queryKey: ['tokenBalances', address],
    queryFn: () => fetchTokenBalances(address!),
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

  if (!balances || balances.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          No Tokens Found
        </h2>
        <p className="text-yellow-600">
          No tokens found in this wallet address.
        </p>
      </div>
    );
  }

  // Filter out tokens with zero balance
  const activeBalances = balances.filter(
    (token) => parseFloat(token.balance) > 0
  );

  return (
    <div className="space-y-6">
      <PortfolioSummary balances={activeBalances} />
      <TokenList balances={activeBalances} />
    </div>
  );
}
