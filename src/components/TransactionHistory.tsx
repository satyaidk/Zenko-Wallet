'use client';

import { useAccount, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, Transaction, getExplorerUrl, getExplorerName } from '@/lib/api';
import { LoadingSpinner } from './LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, RefreshCw, ArrowRightLeft, Zap } from 'lucide-react';

interface TransactionHistoryProps {
  className?: string;
}

interface TransactionAnalysis {
  type: 'send' | 'receive' | 'swap' | 'bridge' | 'contract';
  primaryToken: {
    symbol: string;
    amount: string;
    value: number;
    decimals: number;
    logo_url?: string;
  } | null;
  secondaryToken?: {
    symbol: string;
    amount: string;
    value: number;
    decimals: number;
    logo_url?: string;
  };
}

function analyzeTransaction(tx: Transaction, userAddress: string, chainId: number): TransactionAnalysis {
  const isUserSender = tx.from_address.toLowerCase() === userAddress.toLowerCase();
  
  // Check if it's a native token transaction (ETH, MATIC, etc.)
  const nativeValue = parseFloat(tx.value);
  const hasNativeTransfer = nativeValue > 0;
  
  // Get token transfers from log events (if available)
  const tokenTransfers = tx.transfers || [];
  
  // Determine transaction type and primary token
  if (tokenTransfers.length > 0) {
    // Token transaction
    const userTransfers = tokenTransfers.filter(transfer => 
      transfer.from_address.toLowerCase() === userAddress.toLowerCase() ||
      transfer.to_address.toLowerCase() === userAddress.toLowerCase()
    );
    
    if (userTransfers.length > 1) {
      // Multiple token transfers - likely a swap
      const sentTransfer = userTransfers.find(t => t.from_address.toLowerCase() === userAddress.toLowerCase());
      const receivedTransfer = userTransfers.find(t => t.to_address.toLowerCase() === userAddress.toLowerCase());
      
      return {
        type: 'swap',
        primaryToken: sentTransfer ? {
          symbol: sentTransfer.contract_ticker_symbol,
          amount: sentTransfer.balance,
          value: sentTransfer.balance_quote,
          decimals: sentTransfer.contract_decimals,
          logo_url: sentTransfer.logo_url
        } : null,
        secondaryToken: receivedTransfer ? {
          symbol: receivedTransfer.contract_ticker_symbol,
          amount: receivedTransfer.balance,
          value: receivedTransfer.balance_quote,
          decimals: receivedTransfer.contract_decimals,
          logo_url: receivedTransfer.logo_url
        } : undefined
      };
    } else if (userTransfers.length === 1) {
      // Single token transfer
      const transfer = userTransfers[0];
      const isSent = transfer.from_address.toLowerCase() === userAddress.toLowerCase();
      
      return {
        type: isSent ? 'send' : 'receive',
        primaryToken: {
          symbol: transfer.contract_ticker_symbol,
          amount: transfer.balance,
          value: transfer.balance_quote,
          decimals: transfer.contract_decimals,
          logo_url: transfer.logo_url
        }
      };
    }
  }
  
  // Native token transaction
  if (hasNativeTransfer) {
    const nativeSymbol = chainId === 137 ? 'MATIC' : chainId === 10 ? 'ETH' : chainId === 42161 ? 'ETH' : chainId === 56 ? 'BNB' : chainId === 250 ? 'FTM' : chainId === 43114 ? 'AVAX' : chainId === 25 ? 'CRO' : 'ETH';
    
    return {
      type: isUserSender ? 'send' : 'receive',
      primaryToken: {
        symbol: nativeSymbol,
        amount: tx.value,
        value: tx.value_quote,
        decimals: 18,
        logo_url: undefined
      }
    };
  }
  
  // Contract interaction
  return {
    type: 'contract',
    primaryToken: null
  };
}

export function TransactionHistory({ className = '' }: TransactionHistoryProps) {
  const { address } = useAccount();
  const chainId = useChainId();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', address, chainId],
    queryFn: () => {
      console.log(`Fetching transactions for address: ${address} on chain: ${chainId}`);
      return fetchTransactions(address!, chainId, 20);
    },
    enabled: !!address,
    refetchInterval: 60000, // Refetch every minute
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatValue = (value: string, decimals: number = 18) => {
    const numValue = parseFloat(value) / Math.pow(10, decimals);
    return numValue.toFixed(6);
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTransactionIcon = (analysis: TransactionAnalysis) => {
    switch (analysis.type) {
      case 'send':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'swap':
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
      case 'bridge':
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (analysis: TransactionAnalysis) => {
    switch (analysis.type) {
      case 'send':
        return 'text-red-600';
      case 'receive':
        return 'text-green-600';
      case 'swap':
        return 'text-blue-600';
      case 'bridge':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionLabel = (analysis: TransactionAnalysis) => {
    switch (analysis.type) {
      case 'send':
        return 'Sent';
      case 'receive':
        return 'Received';
      case 'swap':
        return 'Swapped';
      case 'bridge':
        return 'Bridged';
      default:
        return 'Contract Interaction';
    }
  };


  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Transactions
          </h3>
          <p className="text-red-600">
            Failed to fetch transaction history. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Transactions Found
          </h3>
          <p className="text-gray-600">
            No recent transactions found for this wallet address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        <p className="text-sm text-gray-600 mt-1">
          Recent transactions for your wallet
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {transactions.map((tx) => {
          const analysis = analyzeTransaction(tx, address!, chainId);
          const explorerUrl = getExplorerUrl(chainId, tx.tx_hash);
          const explorerName = getExplorerName(chainId);
          
          return (
            <div key={tx.tx_hash} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    {getTransactionIcon(analysis)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {getTransactionLabel(analysis)}
                      </span>
                      {tx.successful ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(tx.block_signed_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {analysis.primaryToken ? (
                    <div>
                      <div className={`font-medium ${getTransactionColor(analysis)}`}>
                        {analysis.type === 'send' ? '-' : analysis.type === 'receive' ? '+' : ''}
                        {formatValue(analysis.primaryToken.amount, analysis.primaryToken.decimals)} {analysis.primaryToken.symbol}
                      </div>
                      {analysis.primaryToken.value > 0 && (
                        <div className="text-sm text-gray-600">
                          {formatUSD(analysis.primaryToken.value)}
                        </div>
                      )}
                      {analysis.secondaryToken && (
                        <div className="text-sm text-gray-500">
                          → {formatValue(analysis.secondaryToken.amount, analysis.secondaryToken.decimals)} {analysis.secondaryToken.symbol}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Contract Interaction
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>
                    From: {formatAddress(tx.from_address)}
                  </span>
                  <span>
                    To: {formatAddress(tx.to_address)}
                  </span>
                </div>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>View on {explorerName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              {tx.gas_quote > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Gas: {formatUSD(tx.gas_quote)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {transactions.length >= 20 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
            Load More Transactions
          </button>
        </div>
      )}
    </div>
  );
}
