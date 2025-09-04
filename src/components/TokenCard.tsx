'use client';

import { TokenBalance } from '@/lib/api';
import { formatCurrency, formatTokenAmount } from '@/lib/utils';

interface TokenCardProps {
  token: TokenBalance;
}

export function TokenCard({ token }: TokenCardProps) {
  const balance = parseFloat(token.balance);
  const formattedBalance = formatTokenAmount(balance, token.contract_decimals);
  const value = token.quote || 0;
  const price = token.quote_rate || 0;

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 mb-3">
        {token.logo_url ? (
          <img
            src={token.logo_url}
            alt={token.contract_name}
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
          <h3 className="font-semibold text-gray-900 truncate">
            {token.contract_name}
          </h3>
          <p className="text-sm text-gray-500">
            {token.contract_ticker_symbol}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Balance:</span>
          <span className="font-medium text-gray-900">
            {formattedBalance}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(price)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Value:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(value)}
          </span>
        </div>
      </div>
    </div>
  );
}
