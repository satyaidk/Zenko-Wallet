'use client';

import { TokenBalance } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface PortfolioChartsProps {
  balances: TokenBalance[];
  className?: string;
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export function PortfolioCharts({ balances, className = '' }: PortfolioChartsProps) {
  // Prepare data for pie chart (portfolio allocation)
  const pieData = balances
    .filter(balance => balance.quote > 0)
    .map((balance, index) => ({
      name: balance.contract_ticker_symbol,
      value: balance.quote,
      color: COLORS[index % COLORS.length],
      percentage: 0 // Will be calculated
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 tokens

  // Calculate percentages
  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
  pieData.forEach(item => {
    item.percentage = (item.value / totalValue) * 100;
  });

  // Prepare data for bar chart (token values)
  const barData = balances
    .filter(balance => balance.quote > 0)
    .map((balance, index) => ({
      name: balance.contract_ticker_symbol,
      value: balance.quote,
      balance: parseFloat(balance.balance) / Math.pow(10, balance.contract_decimals),
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 tokens for better readability

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { percentage?: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Value: {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-gray-600">
              Allocation: {formatPercentage(payload[0].payload.percentage)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (balances.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Portfolio Analytics
        </h2>
        <div className="text-center py-8">
          <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No data available for charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Portfolio Analytics
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Visual breakdown of your portfolio allocation and token values
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Portfolio Allocation Pie Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Portfolio Allocation
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${formatPercentage(percentage)})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Values Bar Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Token Values (USD)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-600">Total Tokens</div>
            <div className="text-2xl font-bold text-blue-900">{balances.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-600">Total Value</div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(balances.reduce((sum, balance) => sum + balance.quote, 0))}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-600">Top Token</div>
            <div className="text-lg font-bold text-purple-900">
              {balances.length > 0 ? balances[0].contract_ticker_symbol : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
