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
          No tokens with non-zero balance found in this wallet address.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Chain ID:</strong> {chainId} {chainId === 137 ? '(Polygon)' : chainId === 1 ? '(Ethereum)' : ''}</p>
          <p><strong>API Status:</strong> {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_COVALENT_API_KEY ? 'Configured' : 'Not configured'}</p>
          <p className="mt-2">Check the browser console for detailed API debugging info.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioSummary balances={balances} />
      <TokenList balances={balances} />
    </div>
  );
}
