'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useAccount, useChainId } from 'wagmi';
import { useAppStore, NFT } from '@/lib/store';
import { NFTData } from '@/lib/api';
import { Image as ImageIcon, ExternalLink, Heart, HeartOff, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function NFTCollection() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { nfts, setNFTs, addNFT, removeNFT } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter NFTs for current chain - memoized to prevent unnecessary re-renders
  const currentChainNFTs = useMemo(() => {
    return nfts.filter(nft => nft.chainId === chainId);
  }, [nfts, chainId]);

  // Fetch NFTs for the current address and chain
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) {
        setNFTs([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Using Covalent API for NFT data
        const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
        if (!apiKey) {
          throw new Error('Covalent API key not configured. Please add NEXT_PUBLIC_COVALENT_API_KEY to your environment variables.');
        }

        const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}&nft=true&no-spam=true`;
        
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 562) {
            throw new Error('API rate limit exceeded or invalid API key. Please check your Covalent API key and try again later.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
        }

        const nftItems = data.data?.items || [];
        const nftData: NFT[] = [];

        // Process NFT data
        nftItems.forEach((item: NFTData) => {
          if (item.type === 'nft' && item.nft_data && item.nft_data.length > 0) {
            item.nft_data.forEach((nft) => {
              const nftItem: NFT = {
                id: `${item.contract_address}-${nft.token_id}-${chainId}`,
                contractAddress: item.contract_address,
                tokenId: nft.token_id,
                name: nft.external_data?.name || `${item.contract_name} #${nft.token_id}`,
                description: nft.external_data?.description,
                imageUrl: nft.external_data?.image || nft.external_data?.image_256,
                floorPrice: nft.external_data?.floor_price_usd,
                chainId: chainId,
                collectionName: item.contract_name,
                attributes: nft.external_data?.attributes || [],
              };
              nftData.push(nftItem);
            });
          }
        });

        setNFTs(nftData);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch NFTs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [address, chainId, setNFTs]);

  const handleToggleFavorite = (nft: NFT) => {
    if (nfts.some(n => n.id === nft.id)) {
      removeNFT(nft.id);
    } else {
      addNFT(nft);
    }
  };

  const getExplorerUrl = (contractAddress: string, tokenId: string) => {
    const explorers: Record<number, string> = {
      1: `https://etherscan.io/token/${contractAddress}?a=${tokenId}`,
      137: `https://polygonscan.com/token/${contractAddress}?a=${tokenId}`,
      42161: `https://arbiscan.io/token/${contractAddress}?a=${tokenId}`,
      10: `https://optimistic.etherscan.io/token/${contractAddress}?a=${tokenId}`,
      8453: `https://basescan.org/token/${contractAddress}?a=${tokenId}`,
      56: `https://bscscan.com/token/${contractAddress}?a=${tokenId}`,
      43114: `https://snowtrace.io/token/${contractAddress}?a=${tokenId}`,
      250: `https://ftmscan.com/token/${contractAddress}?a=${tokenId}`,
    };
    
    return explorers[chainId] || explorers[1];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading NFTs...</h3>
          <p className="text-gray-500">Fetching your NFT collection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading NFTs</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentChainNFTs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center py-12">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No NFTs Found</h3>
          <p className="text-gray-500 mb-4">
            No NFTs found in this wallet address on the current network.
          </p>
          <p className="text-sm text-gray-400">
            Try switching to a different network or check another wallet address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mr-2" />
          NFT Collection ({currentChainNFTs.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {currentChainNFTs.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* NFT Image */}
            <div className="aspect-square bg-gray-200 relative">
              {nft.imageUrl ? (
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-nft.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Favorite Button */}
              <button
                onClick={() => handleToggleFavorite(nft)}
                className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                title="Toggle favorite"
              >
                {nfts.some(n => n.id === nft.id) ? (
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                ) : (
                  <HeartOff className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* NFT Details */}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 truncate mb-1 text-sm sm:text-base">
                {nft.name}
              </h3>
              
              {nft.collectionName && (
                <p className="text-xs sm:text-sm text-gray-500 truncate mb-2">
                  {nft.collectionName}
                </p>
              )}

              {/* Floor Price */}
              {nft.floorPrice && (
                <div className="flex items-center space-x-1 mb-2 sm:mb-3">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-green-600">
                    Floor: {formatCurrency(nft.floorPrice)}
                  </span>
                </div>
              )}

              {/* Token ID */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Token #{nft.tokenId}
                </span>
                
                <a
                  href={getExplorerUrl(nft.contractAddress, nft.tokenId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </div>

              {/* Attributes */}
              {nft.attributes && nft.attributes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Attributes:</div>
                  <div className="flex flex-wrap gap-1">
                    {nft.attributes.slice(0, 3).map((attr, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                      >
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                    {nft.attributes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        +{nft.attributes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
