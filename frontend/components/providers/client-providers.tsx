'use client';

import { Providers } from "@/lib/providers";
import { Toaster } from 'react-hot-toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <Toaster position="top-right" />
    </Providers>
  );
} 