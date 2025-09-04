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

