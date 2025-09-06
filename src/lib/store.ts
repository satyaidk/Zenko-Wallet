import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomToken {
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoUrl?: string;
  addedAt: number;
}

export interface WatchlistToken {
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  chainId: number;
  logoUrl?: string;
  addedAt: number;
}

export interface NFT {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  floorPrice?: number;
  chainId: number;
  collectionName?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface AppState {
  // Watchlist
  watchlist: WatchlistToken[];
  addToWatchlist: (token: Omit<WatchlistToken, 'id' | 'addedAt'>) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (contractAddress: string, chainId: number) => boolean;
  
  // Custom Tokens
  customTokens: CustomToken[];
  addCustomToken: (token: Omit<CustomToken, 'id' | 'addedAt'>) => void;
  removeCustomToken: (id: string) => void;
  getCustomTokensForChain: (chainId: number) => CustomToken[];
  
  // NFTs
  nfts: NFT[];
  setNFTs: (nfts: NFT[]) => void;
  addNFT: (nft: Omit<NFT, 'id'>) => void;
  removeNFT: (id: string) => void;
  
  // UI State
  selectedChainId: number;
  setSelectedChainId: (chainId: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Watchlist
      watchlist: [],
      addToWatchlist: (token) => {
        const id = `${token.contractAddress}-${token.chainId}`;
        const newToken: WatchlistToken = {
          ...token,
          id,
          addedAt: Date.now(),
        };
        
        set((state) => ({
          watchlist: [...state.watchlist.filter(t => t.id !== id), newToken],
        }));
      },
      removeFromWatchlist: (id) => {
        set((state) => ({
          watchlist: state.watchlist.filter(t => t.id !== id),
        }));
      },
      isInWatchlist: (contractAddress, chainId) => {
        const id = `${contractAddress}-${chainId}`;
        return get().watchlist.some(t => t.id === id);
      },
      
      // Custom Tokens
      customTokens: [],
      addCustomToken: (token) => {
        const id = `${token.contractAddress}-${token.chainId}`;
        const newToken: CustomToken = {
          ...token,
          id,
          addedAt: Date.now(),
        };
        
        set((state) => ({
          customTokens: [...state.customTokens.filter(t => t.id !== id), newToken],
        }));
      },
      removeCustomToken: (id) => {
        set((state) => ({
          customTokens: state.customTokens.filter(t => t.id !== id),
        }));
      },
      getCustomTokensForChain: (chainId) => {
        return get().customTokens.filter(t => t.chainId === chainId);
      },
      
      // NFTs
      nfts: [],
      setNFTs: (nfts) => set({ nfts }),
      addNFT: (nft) => {
        const id = `${nft.contractAddress}-${nft.tokenId}-${nft.chainId}`;
        const newNFT: NFT = {
          ...nft,
          id,
        };
        
        set((state) => ({
          nfts: [...state.nfts.filter(n => n.id !== id), newNFT],
        }));
      },
      removeNFT: (id) => {
        set((state) => ({
          nfts: state.nfts.filter(n => n.id !== id),
        }));
      },
      
      // UI State
      selectedChainId: 1, // Default to Ethereum
      setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
    }),
    {
      name: 'portfolio-wallet-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        customTokens: state.customTokens,
        nfts: state.nfts,
        selectedChainId: state.selectedChainId,
      }),
    }
  )
);

// Chain information helper
export const CHAIN_INFO = {
  1: { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  137: { name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
  42161: { name: 'Arbitrum', symbol: 'ETH', color: '#28A0F0' },
  10: { name: 'Optimism', symbol: 'ETH', color: '#FF0420' },
  8453: { name: 'Base', symbol: 'ETH', color: '#0052FF' },
  56: { name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
  43114: { name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
  250: { name: 'Fantom', symbol: 'FTM', color: '#1969FF' },
  25: { name: 'Cronos', symbol: 'CRO', color: '#002D74' },
  1284: { name: 'Moonbeam', symbol: 'GLMR', color: '#53CBC9' },
  1285: { name: 'Moonriver', symbol: 'MOVR', color: '#F2A900' },
  1666600000: { name: 'Harmony', symbol: 'ONE', color: '#00D4AA' },
  42220: { name: 'Celo', symbol: 'CELO', color: '#35D07F' },
  100: { name: 'Gnosis', symbol: 'GNO', color: '#3E6957' },
  1313161554: { name: 'Aurora', symbol: 'ETH', color: '#78D64B' },
  1088: { name: 'Metis', symbol: 'METIS', color: '#00DACC' },
  1101: { name: 'Polygon zkEVM', symbol: 'ETH', color: '#8247E5' },
  42170: { name: 'Arbitrum Nova', symbol: 'ETH', color: '#28A0F0' },
} as const;

export const getChainInfo = (chainId: number) => {
  return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO] || { 
    name: `Chain ${chainId}`, 
    symbol: 'TOKEN', 
    color: '#6B7280' 
  };
};
