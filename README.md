# Zenko Wallet DApp

A comprehensive, multi-chain DApp for tracking your cryptocurrency portfolio, NFTs, and managing custom tokens. Connect your wallet and view your assets across multiple blockchain networks.

## Features

- 🔗 **Multi-Chain Support**: Support for 18+ blockchain networks including Ethereum, Polygon, Arbitrum, Optimism, Base, BSC, Avalanche, Fantom, and more
- 💰 **Portfolio Tracking**: View all your ERC-20 token balances with real-time prices
- ⭐ **Watchlist**: Track your favorite tokens across all supported chains
- 🎯 **Custom Tokens**: Add and manage custom tokens that aren't automatically detected
- 💎 **NFT Collection**: View and manage your NFT collection with images and floor prices
- 🪙 **Stablecoin Support**: Comprehensive support for all major stablecoins across all chains
- 📊 **Analytics**: Portfolio allocation charts and performance tracking
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS
- ⚡ **Fast Performance**: Optimized with React Query and Zustand for efficient data management
- 💾 **Local Storage**: Persistent storage for watchlists and custom tokens

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Web3**: wagmi, RainbowKit, ethers.js, viem
- **Data**: Covalent API, CoinGecko API
- **State Management**: TanStack Query, Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for Covalent and Alchemy (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Zenko-Wallet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:

```env
# WalletConnect Project ID (required for wallet connections)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Alchemy API Key (optional - for better performance)
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key_here

# Covalent API Key (required for token balances)
NEXT_PUBLIC_COVALENT_API_KEY=your_covalent_api_key_here

# Optional: CoinGecko API Key (for enhanced rate limits)
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key_here
```

### Getting API Keys

1. **WalletConnect Project ID** (Required):
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up for a free account
   - Create a new project and get your Project ID

2. **Covalent API** (Required): 
   - Visit [Covalent](https://www.covalenthq.com/)
   - Sign up for a free account
   - Get your API key from the dashboard

3. **Alchemy API** (Optional):
   - Visit [Alchemy](https://www.alchemy.com/)
   - Create a free account
   - Create a new app and get your API key

4. **CoinGecko API** (Optional):
   - Visit [CoinGecko](https://www.coingecko.com/en/api)
   - Sign up for a free account
   - Get your API key for higher rate limits

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Connect your wallet and start tracking your portfolio!

## Usage

### Basic Portfolio Management
1. **Connect Wallet**: Click the "Connect Wallet" button and select your preferred wallet
2. **Select Network**: Use the chain selector to switch between supported networks
3. **View Portfolio**: Once connected, your token balances and portfolio value will be displayed
4. **Search & Sort**: Use the search bar to find specific tokens and sort by value, name, or balance
5. **Real-time Updates**: The portfolio automatically refreshes every 30 seconds

### Advanced Features
1. **Watchlist**: Click the star icon on any token to add it to your watchlist
2. **Custom Tokens**: Click "Add Custom Token" to manually add tokens not automatically detected
3. **NFT Collection**: Switch to the NFTs tab to view your NFT collection with images and floor prices
4. **Analytics**: View portfolio allocation charts and performance metrics
5. **Multi-Chain**: Switch between networks to view your assets across different blockchains

## Supported Networks

- **Ethereum** (Mainnet)
- **Polygon** (MATIC)
- **Arbitrum** (One & Nova)
- **Optimism**
- **Base**
- **BSC** (Binance Smart Chain)
- **Avalanche** (C-Chain)
- **Fantom**
- **Cronos**
- **Moonbeam**
- **Moonriver**
- **Harmony One**
- **Celo**
- **Gnosis**
- **Aurora**
- **Metis**
- **Polygon zkEVM**

## Supported Stablecoins

The app automatically detects and highlights stablecoins across all supported networks:

- **USDC** - USD Coin
- **USDT** - Tether
- **DAI** - Dai Stablecoin
- **BUSD** - Binance USD
- **TUSD** - TrueUSD
- **FRAX** - Frax
- **LUSD** - Liquity USD
- **SUSD** - Synthetix USD
- **GUSD** - Gemini Dollar
- **USDP** - Pax Dollar

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── providers.tsx   # Web3 providers
├── components/         # React components
│   ├── Header.tsx      # Navigation header
│   ├── Portfolio.tsx   # Main portfolio component
│   ├── PortfolioSummary.tsx
│   ├── PortfolioCharts.tsx
│   ├── TokenList.tsx
│   ├── TokenCard.tsx
│   ├── TransactionHistory.tsx
│   ├── ChainSelector.tsx
│   ├── Watchlist.tsx
│   ├── CustomTokenManager.tsx
│   ├── NFTCollection.tsx
│   └── LoadingSpinner.tsx
└── lib/               # Utilities and configurations
    ├── wagmi.ts       # Web3 configuration
    ├── api.ts         # API functions
    ├── store.ts       # Zustand state management
    └── utils.ts       # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Roadmap

- [x] Multi-chain support (18+ networks)
- [x] NFT support (ERC-721, ERC-1155)
- [x] Watchlist functionality
- [x] Custom token management
- [x] Comprehensive stablecoin support
- [x] Portfolio analytics and charts
- [ ] Portfolio performance tracking over time
- [ ] Export portfolio data (CSV, PDF)
- [ ] Multiple wallet support
- [ ] Dark mode
- [ ] Mobile app
- [ ] DeFi protocol integration
<<<<<<< HEAD
- [ ] Price alerts and notifications
- [ ] Portfolio sharing features
- [ ] Advanced filtering and sorting options
=======
>>>>>>> 32534a6fa96ac9ebf2f8a87cbad10b1f337a4992
