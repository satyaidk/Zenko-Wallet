// API configuration and utility functions

export interface TokenBalance {
  contract_address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_decimals: number;
  balance: string;
  quote: number;
  quote_rate: number;
  logo_url?: string;
}

export interface PortfolioData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: TokenBalance[];
}

export interface TokenTransfer {
  contract_address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_decimals: number;
  from_address: string;
  to_address: string;
  balance: string;
  balance_quote: number;
  quote_rate: number;
  logo_url?: string;
}

export interface Transaction {
  block_signed_at: string;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label?: string;
  to_address: string;
  to_address_label?: string;
  value: string;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  gas_quote: number;
  gas_quote_rate: number;
  log_events: unknown[];
  transfers?: TokenTransfer[];
}

export interface TransactionData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: Transaction[];
}

// Covalent API configuration
const COVALENT_API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY || '';
const COVALENT_BASE_URL = 'https://api.covalenthq.com/v1';

// CoinGecko API configuration
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchTokenBalances(
  address: string,
  chainId: number = 1
): Promise<TokenBalance[]> {
  try {
    console.log('=== API Debug Info ===');
    console.log('Address:', address);
    console.log('Chain ID:', chainId);
    console.log('API Key exists:', !!COVALENT_API_KEY);
    console.log('API Key length:', COVALENT_API_KEY ? COVALENT_API_KEY.length : 0);
    
    if (!COVALENT_API_KEY) {
      console.error('❌ Covalent API key not provided. Cannot fetch real token data.');
      console.log('Environment check:', {
        NEXT_PUBLIC_COVALENT_API_KEY: process.env.NEXT_PUBLIC_COVALENT_API_KEY ? 'exists' : 'missing',
        COVALENT_API_KEY: COVALENT_API_KEY ? 'exists' : 'missing'
      });
      return [];
    }

    const url = `${COVALENT_BASE_URL}/${chainId}/address/${address}/balances_v2/?key=${COVALENT_API_KEY}&nft=false&no-spam=true&quote-currency=USD`;
    console.log('🔗 Fetching from URL:', url);
    
    const response = await fetch(url);
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 API Response:', data);
    
    if (data.error) {
      console.error('❌ API Error:', data.error);
      throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
    }
    
    const items = data.data?.items || [];
    console.log(`✅ Found ${items.length} total tokens for address ${address} on chain ${chainId}`);
    
    // Filter out tokens with zero balance
    const activeItems = items.filter((item: TokenBalance) => {
      const balance = parseFloat(item.balance);
      return balance > 0;
    });
    
    console.log(`💰 Found ${activeItems.length} tokens with non-zero balance`);
    console.log('Active tokens:', activeItems.map((item: TokenBalance) => ({
      name: item.contract_name,
      symbol: item.contract_ticker_symbol,
      balance: item.balance,
      value: item.quote
    })));
    console.log('=== End API Debug ===');
    
    return activeItems;
  } catch (error) {
    console.error('❌ Error fetching token balances:', error);
    console.log('=== End API Debug (Error) ===');
    // Return empty array instead of fallback data
    return [];
  }
}


export async function fetchTokenPrice(tokenId: string): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${tokenId}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[tokenId]?.usd || 0;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return 0;
  }
}

export async function fetchMultipleTokenPrices(tokenIds: string[]): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const prices: Record<string, number> = {};
    
    tokenIds.forEach(id => {
      prices[id] = data[id]?.usd || 0;
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    return {};
  }
}

// Token mapping for CoinGecko IDs
export const TOKEN_MAPPING: Record<string, string> = {
  '0xa0b86a33e6ba0e0e5c4c4b4b4b4b4b4b4b4b4b4b': 'ethereum',
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai',
  '0xa0b86a33e6ba0e0e5c4c4b4b4b4b4b4b4b4b4b4b4': 'usd-coin',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'matic-network',
  '0x514910771af9ca656af840dff83e8264ecf986ca': 'chainlink',
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': 'maker',
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942': 'decentraland',
  '0x4fabb145d64652a948d72533023f6e7a623c7c53': 'binance-usd',
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': 'shiba-inu',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'aave',
  '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2': 'sushi',
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e': 'yearn-finance',
  '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c': 'bancor',
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef': 'basic-attention-token',
  '0x1985365e9f78359a9b6ad760e32412f4a445e862': 'augur',
  '0x960b236a07cf122663c4303350609a66a7b288c0': 'aragon',
  '0x6810e776880c02933d47db1b9fc05908e5386b96': 'gnosis',
  '0x4e15361fd6b4bb609fa63c81a2be19d873717870': 'fantom',
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1': 'paxos-standard',
  '0xdd974d5c2e2928dea5f71b9825b8b646686bd200': 'kyber-network-crystal',
  '0x408e41876cccdc0f92210600ef50372656052a38': 'republic-protocol',
};

export function getTokenId(contractAddress: string): string {
  return TOKEN_MAPPING[contractAddress.toLowerCase()] || 'ethereum';
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: `https://etherscan.io/tx/${txHash}`, // Ethereum
    137: `https://polygonscan.com/tx/${txHash}`, // Polygon
    10: `https://optimistic.etherscan.io/tx/${txHash}`, // Optimism
    42161: `https://arbiscan.io/tx/${txHash}`, // Arbitrum
    56: `https://bscscan.com/tx/${txHash}`, // BSC
    250: `https://ftmscan.com/tx/${txHash}`, // Fantom
    43114: `https://snowtrace.io/tx/${txHash}`, // Avalanche
    25: `https://cronoscan.com/tx/${txHash}`, // Cronos
  };
  
  return explorers[chainId] || explorers[1]; // Default to Etherscan
}

export function getExplorerName(chainId: number): string {
  const names: Record<number, string> = {
    1: 'Etherscan',
    137: 'Polygonscan',
    10: 'Optimistic Etherscan',
    42161: 'Arbiscan',
    56: 'BSCScan',
    250: 'FTMScan',
    43114: 'Snowtrace',
    25: 'Cronoscan',
  };
  
  return names[chainId] || 'Etherscan';
}

export async function fetchTransactions(
  address: string,
  chainId: number = 1,
  pageSize: number = 50
): Promise<Transaction[]> {
  try {
    console.log('=== Transaction API Debug Info ===');
    console.log('Address:', address);
    console.log('Chain ID:', chainId);
    console.log('Page Size:', pageSize);
    console.log('API Key exists:', !!COVALENT_API_KEY);
    
    if (!COVALENT_API_KEY) {
      console.error('❌ Covalent API key not provided. Cannot fetch transaction data.');
      return [];
    }

    const url = `${COVALENT_BASE_URL}/${chainId}/address/${address}/transactions_v3/?key=${COVALENT_API_KEY}&page-size=${pageSize}&quote-currency=USD&no-logs=false`;
    console.log('🔗 Fetching transactions from URL:', url);
    
    const response = await fetch(url);
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 Transaction API Response:', data);
    
    if (data.error) {
      console.error('❌ API Error:', data.error);
      throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
    }
    
    const items = data.data?.items || [];
    console.log(`✅ Found ${items.length} transactions for address ${address} on chain ${chainId}`);
    console.log('=== End Transaction API Debug ===');
    
    return items;
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    console.log('=== End Transaction API Debug (Error) ===');
    return [];
  }
}

// NFT interfaces
export interface NFTData {
  contract_address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_decimals: number;
  supports_erc: string[];
  logo_url?: string;
  type: string;
  nft_data?: Array<{
    token_id: string;
    token_balance: string;
    token_url?: string;
    external_data?: {
      name?: string;
      description?: string;
      image?: string;
      image_256?: string;
      image_512?: string;
      image_1024?: string;
      animation_url?: string;
      external_url?: string;
      attributes?: Array<{
        trait_type: string;
        value: string | number;
      }>;
      floor_price_usd?: number;
    };
  }>;
}

// Comprehensive stablecoin mapping across all chains
export const STABLECOIN_ADDRESSES: Record<number, Record<string, string>> = {
  // Ethereum
  1: {
    'USDC': '0xa0b86a33e6ba0e0e5c4c4b4b4b4b4b4b4b4b4b4b',
    'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
    'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
    'BUSD': '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    'TUSD': '0x0000000000085d4780b73119b644ae5ecd22b376',
    'USDP': '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    'FRAX': '0x853d955acef822db058eb8505911ed77f175b99e',
    'LUSD': '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
    'SUSD': '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    'GUSD': '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
  },
  // Polygon
  137: {
    'USDC': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    'USDT': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    'DAI': '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    'BUSD': '0x9c9e5fd8bbc25984b178fdce6117defa39d2db39',
    'FRAX': '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89',
    'TUSD': '0x2e1ad108ff1d8c782fcbbb89aad783ac49586756',
  },
  // Arbitrum
  42161: {
    'USDC': '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    'USDT': '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    'DAI': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    'FRAX': '0x17fc002b466eec40dae837fc4be5c67993ddbd6f',
    'LUSD': '0x93b346b6bc2548da6a1e7d98e9a421b42541425b',
  },
  // Optimism
  10: {
    'USDC': '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    'USDT': '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    'DAI': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    'FRAX': '0x2e3d870790dc77a83dd1d18184acc7439a53f475',
    'LUSD': '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819',
  },
  // Base
  8453: {
    'USDC': '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    'DAI': '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
  },
  // BSC
  56: {
    'USDC': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    'USDT': '0x55d398326f99059ff775485246999027b3197955',
    'BUSD': '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    'DAI': '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    'TUSD': '0x14016e85a25aeb13065688cafb43044c2ef86784',
    'FRAX': '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40',
  },
  // Avalanche
  43114: {
    'USDC': '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    'USDT': '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    'DAI': '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
    'FRAX': '0xd24c2ad096400b6fbcd2ad8b24e7acbc21a1da64',
    'TUSD': '0x1c20e891bab6b1727d14da358fae2984ed9b59eb',
  },
  // Fantom
  250: {
    'USDC': '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    'USDT': '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    'DAI': '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    'FRAX': '0xdc301622e621166bd8e82f2ca0a26c13ad0be355',
    'TUSD': '0x9879abdea01a879644185341f7af7d8343559bca',
  },
  // Cronos
  25: {
    'USDC': '0xc21223249ca28397b4b6541dffaecc539bff0c59',
    'USDT': '0x66e428c3f67a68878562e79a0234c1f83c208770',
    'DAI': '0xf2001b145b43032aaf5ee2884e456ccd805f677d',
  },
};

export function isStablecoin(contractAddress: string, chainId: number): boolean {
  const stablecoins = STABLECOIN_ADDRESSES[chainId];
  if (!stablecoins) return false;
  
  return Object.values(stablecoins).some(addr => 
    addr.toLowerCase() === contractAddress.toLowerCase()
  );
}

export function getStablecoinSymbol(contractAddress: string, chainId: number): string | null {
  const stablecoins = STABLECOIN_ADDRESSES[chainId];
  if (!stablecoins) return null;
  
  for (const [symbol, address] of Object.entries(stablecoins)) {
    if (address.toLowerCase() === contractAddress.toLowerCase()) {
      return symbol;
    }
  }
  return null;
}

export async function fetchNFTs(
  address: string,
  chainId: number = 1
): Promise<NFTData[]> {
  try {
    console.log('=== NFT API Debug Info ===');
    console.log('Address:', address);
    console.log('Chain ID:', chainId);
    console.log('API Key exists:', !!COVALENT_API_KEY);
    
    if (!COVALENT_API_KEY) {
      console.error('❌ Covalent API key not provided. Cannot fetch NFT data.');
      return [];
    }

    const url = `${COVALENT_BASE_URL}/${chainId}/address/${address}/balances_v2/?key=${COVALENT_API_KEY}&nft=true&no-spam=true`;
    console.log('🔗 Fetching NFTs from URL:', url);
    
    const response = await fetch(url);
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 NFT API Response:', data);
    
    if (data.error) {
      console.error('❌ API Error:', data.error);
      throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
    }
    
    const items = data.data?.items || [];
    const nftItems = items.filter((item: NFTData) => item.type === 'nft' && item.nft_data && item.nft_data.length > 0);
    
    console.log(`✅ Found ${nftItems.length} NFT collections for address ${address} on chain ${chainId}`);
    console.log('=== End NFT API Debug ===');
    
    return nftItems;
  } catch (error) {
    console.error('❌ Error fetching NFTs:', error);
    console.log('=== End NFT API Debug (Error) ===');
    return [];
  }
}