#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Portfolio Wallet DApp...\n');

// Create .env.local file if it doesn't exist
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# Environment variables for Portfolio Wallet DApp
# Replace with your actual API keys

# WalletConnect Project ID (required for wallet connections)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Alchemy API Key (optional - for better performance)
NEXT_PUBLIC_ALCHEMY_ID=

# Covalent API Key (required for token balances)
NEXT_PUBLIC_COVALENT_API_KEY=

# CoinGecko API Key (optional - for higher rate limits)
NEXT_PUBLIC_COINGECKO_API_KEY=
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('ℹ️  .env.local file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Get your API keys:');
console.log('   - WalletConnect: https://cloud.walletconnect.com/ (required)');
console.log('   - Covalent: https://www.covalenthq.com/ (required)');
console.log('   - Alchemy: https://www.alchemy.com/ (optional)');
console.log('   - CoinGecko: https://www.coingecko.com/en/api (optional)');
console.log('\n2. Add your API keys to .env.local');
console.log('\n3. Run: npm run dev');
console.log('\n4. Open http://localhost:3000 in your browser');
console.log('\n🎉 Happy portfolio tracking!');
