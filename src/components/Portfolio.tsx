'use client';

import { useAccount, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenBalances } from '@/lib/api';
import { TokenList } from './TokenList';
import { PortfolioSummary } from './PortfolioSummary';
import { LoadingSpinner } from './LoadingSpinner';

export function Portfolio() {
  const { address } = useAccount();
  const chainId = useChainId();

  const { data: balances, isLoading, error } = useQuery({
    queryKey: ['tokenBalances', address, chainId],
    queryFn: () => {
      console.log(`Fetching balances for address: ${address} on chain: ${chainId}`);
      return fetchTokenBalances(address!, chainId);
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

  if (!balances || balances.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          No Tokens Found
        </h2>
        <p className="text-yellow-600 mb-4">
          No tokens found in this wallet address.
        </p>
        <div className="text-sm text-gray-500">
          <p>Address: {address}</p>
          <p>Chain ID: {chainId}</p>
          <p>Check the browser console for API debugging info.</p>
        </div>
      </div>
    );
  }

  // Filter out tokens with zero balance
  const activeBalances = balances.filter(
    (token) => parseFloat(token.balance) > 0
  );

  if (activeBalances.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Tokens Found but No Active Balances
        </h2>
        <p className="text-blue-600 mb-4">
          Found {balances.length} tokens but all have zero balance.
        </p>
        <div className="text-sm text-gray-500">
          <p>Address: {address}</p>
          <p>Chain ID: {chainId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioSummary balances={activeBalances} />
      <TokenList balances={activeBalances} />
    </div>
  );
}
