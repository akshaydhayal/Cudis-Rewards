'use client';

import dynamic from 'next/dynamic';
import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';

const DynamicWalletProvider = dynamic(() => import('@/components/WalletProvider'), { ssr: false });
const DynamicNavbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DynamicWalletProvider>
      <RecoilRoot>
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicNavbar />
          <main className="p-4">{children}</main>
        </Suspense>
      </RecoilRoot>
    </DynamicWalletProvider>
  );
}