// File: app/layout.tsx


import './globals.css';
import { NavBar } from '@/components/molecules/NavBar';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">

      <head />

      <body>
        <SpeedInsights />
        <Analytics />
        <SessionProvider >
          <NavBar />
        </SessionProvider>

        {children}

      </body>
    </html>
  );
}
