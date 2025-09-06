'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Portfolio } from '@/components/Portfolio';
import { Header } from '@/components/Header';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Zenko Wallet
              </h1>
              <p className="text-gray-600 mb-8">
                Connect your wallet to start tracking your crypto portfolio
              </p>
              <ConnectButton />
            </div>
          </div>
        ) : (
          <Portfolio />
        )}
      </div>
    </main>
  );
}