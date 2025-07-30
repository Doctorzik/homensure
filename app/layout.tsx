// File: app/layout.tsx


import './globals.css';
import { NavBar } from '@/components/molecules/NavBar';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionProvider >
          <NavBar />
        </SessionProvider>

        {children}

      </body>
    </html>
  );
}
