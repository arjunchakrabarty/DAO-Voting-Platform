'use client';

import { useWalletStore } from '@/store/walletStore';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { publicKey, connect, disconnect } = useWalletStore();

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Nexus DAO
          </span>
        </div>

        <div>
          {publicKey ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
              </span>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connect} className="bg-white text-black hover:bg-gray-200">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
