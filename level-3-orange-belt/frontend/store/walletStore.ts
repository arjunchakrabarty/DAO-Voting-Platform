import { create } from 'zustand';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';

interface WalletState {
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// Initialize the kit globally for the entire app
StellarWalletsKit.init({
  modules: [new FreighterModule(), new xBullModule(), new AlbedoModule()],
  network: Networks.TESTNET,
});

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  connect: async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      set({ publicKey: address });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  },
  disconnect: () => {
    StellarWalletsKit.disconnect().catch(console.error);
    set({ publicKey: null });
  },
}));
