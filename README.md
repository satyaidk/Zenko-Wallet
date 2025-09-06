# Zenko Wallet DApp

A modern, responsive DApp for tracking your cryptocurrency portfolio. Connect your wallet and view your token balances, portfolio value, and more.

## Features

- 🔗 **Wallet Connection**: Connect with MetaMask, WalletConnect, and other popular wallets
- 💰 **Portfolio Tracking**: View all your ERC-20 token balances
- 📊 **Real-time Prices**: Get current token prices and portfolio values
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS
- ⚡ **Fast Performance**: Optimized with React Query for efficient data fetching

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Web3**: wagmi, RainbowKit, ethers.js
- **Data**: Covalent API, CoinGecko API
- **State Management**: TanStack Query

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

1. **Connect Wallet**: Click the "Connect Wallet" button and select your preferred wallet
2. **View Portfolio**: Once connected, your token balances and portfolio value will be displayed
3. **Search & Sort**: Use the search bar to find specific tokens and sort by value, name, or balance
4. **Real-time Updates**: The portfolio automatically refreshes every 30 seconds

## Supported Networks

- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism

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
│   ├── TokenList.tsx
│   ├── TokenCard.tsx
│   └── LoadingSpinner.tsx
└── lib/               # Utilities and configurations
    ├── wagmi.ts       # Web3 configuration
    ├── api.ts         # API functions
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

- [ ] NFT support (ERC-721, ERC-1155)
- [ ] Portfolio performance tracking
- [ ] Export portfolio data
- [ ] Multiple wallet support
- [ ] Dark mode
- [ ] Mobile app
- [ ] DeFi protocol integration
