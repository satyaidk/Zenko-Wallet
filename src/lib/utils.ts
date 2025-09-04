// Utility functions for formatting and calculations

export function formatCurrency(value: number): string {
  if (value === 0) return '$0.00';
  
  if (value < 0.01) {
    return `$${value.toExponential(2)}`;
  }
  
  if (value < 1) {
    return `$${value.toFixed(4)}`;
  }
  
  if (value < 1000) {
    return `$${value.toFixed(2)}`;
  }
  
  if (value < 1000000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  
  if (value < 1000000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  
  return `$${(value / 1000000000).toFixed(2)}B`;
}

export function formatTokenAmount(amount: number, decimals: number): string {
  const formattedAmount = amount / Math.pow(10, decimals);
  
  if (formattedAmount === 0) return '0';
  
  if (formattedAmount < 0.0001) {
    return formattedAmount.toExponential(2);
  }
  
  if (formattedAmount < 1) {
    return formattedAmount.toFixed(6);
  }
  
  if (formattedAmount < 1000) {
    return formattedAmount.toFixed(4);
  }
  
  if (formattedAmount < 1000000) {
    return `${(formattedAmount / 1000).toFixed(2)}K`;
  }
  
  if (formattedAmount < 1000000000) {
    return `${(formattedAmount / 1000000).toFixed(2)}M`;
  }
  
  return `${(formattedAmount / 1000000000).toFixed(2)}B`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPercentage(value: number): string {
  if (value === 0) return '0%';
  if (Math.abs(value) < 0.01) return `${value.toFixed(4)}%`;
  return `${value.toFixed(2)}%`;
}

export function calculatePortfolioChange(
  currentValue: number,
  previousValue: number
): { change: number; percentage: number } {
  const change = currentValue - previousValue;
  const percentage = previousValue === 0 ? 0 : (change / previousValue) * 100;
  
  return { change, percentage };
}

export function getTokenIconUrl(
  contractAddress: string,
  symbol: string
): string {
  // You can use various token icon services
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddress}/logo.png`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
