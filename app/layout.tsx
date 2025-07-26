import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/components/web3-provider'
import { ThemeProvider } from '@/contexts/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
}

export const metadata: Metadata = {
  title: 'RWA.defi - Real World Assets DeFi Platform',
  description: 'Trade, stake, and invest in tokenized real-world assets including renewable energy, carbon credits, and green bonds.',
  keywords: 'RWA, DeFi, Real World Assets, Tokenization, Renewable Energy, Carbon Credits, Green Finance',
  authors: [{ name: 'RWA.defi Team' }],
  openGraph: {
    title: 'RWA.defi - Real World Assets DeFi Platform',
    description: 'Trade, stake, and invest in tokenized real-world assets',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RWA.defi - Real World Assets DeFi Platform',
    description: 'Trade, stake, and invest in tokenized real-world assets',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}