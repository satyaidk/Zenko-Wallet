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
    if (!COVALENT_API_KEY) {
      console.warn('Covalent API key not provided. Using fallback data.');
      return getFallbackTokenData(address);
    }

    const url = `${COVALENT_BASE_URL}/${chainId}/address/${address}/balances_v2/?key=${COVALENT_API_KEY}&nft=false&no-spam=true&quote-currency=USD`;
    console.log('Fetching token balances from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.error) {
      console.error('API Error:', data.error);
      return getFallbackTokenData(address);
    }
    
    const items = data.data?.items || [];
    console.log(`Found ${items.length} tokens for address ${address}`);
    return items;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return getFallbackTokenData(address);
  }
}

// Fallback function to provide sample data when API fails
function getFallbackTokenData(address: string): TokenBalance[] {
  console.log('Using fallback token data for address:', address);
  return [
    {
      contract_address: '0x0000000000000000000000000000000000000000',
      contract_name: 'Ethereum',
      contract_ticker_symbol: 'ETH',
      contract_decimals: 18,
      balance: '1000000000000000000', // 1 ETH
      quote: 2500.00,
      quote_rate: 2500.00,
      logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      contract_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      contract_name: 'Dai Stablecoin',
      contract_ticker_symbol: 'DAI',
      contract_decimals: 18,
      balance: '500000000000000000000', // 500 DAI
      quote: 500.00,
      quote_rate: 1.00,
      logo_url: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png'
    }
  ];
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
