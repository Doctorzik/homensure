// File: app/layout.tsx


import './globals.css';

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

      <body  >
        <SpeedInsights />
        <Analytics />

        <main className='bg-red-50 max-w-[1000px] m-auto'>{children}</main>

      </body>
    </html>
  );
}
