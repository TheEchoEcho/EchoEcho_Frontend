'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createPublicClient, http } from 'viem'
import { config } from '../wagmi';
import { sepolia } from 'viem/chains'

const queryClient = new QueryClient();

export const client = createPublicClient({
  chain: sepolia,
  transport: http('https://sepolia.infura.io/v3/32076fdc1eec4d01975b561943bd7e8d'),
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale='en-US'>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}