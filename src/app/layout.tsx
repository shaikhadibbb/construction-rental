import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/lib/env'
import Navbar from '@/components/layout/Navbar'
import CTABar from '@/components/ui/CTABar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ConstructRent — Construction Equipment Rental India',
    template: '%s | ConstructRent'
  },
  description: 'Rent professional construction equipment across India. Excavators, cranes, forklifts and more. Get a free quote in 2 hours. Serving Mumbai, Ahmedabad, Gujarat and all of India.',
  keywords: ['construction equipment rental', 'excavator rental', 'crane rental', 'forklift rental', 'JCB rental', 'equipment hire India'],
  openGraph: {
    title: 'ConstructRent — Construction Equipment Rental India',
    description: 'Rent professional construction equipment online. 50+ machines, 2hr quote response, on-site delivery.',
    type: 'website',
    siteName: 'ConstructRent',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: '#080808', margin: 0, padding: 0 }}>
        <Navbar />
        <main>
          {children}
        </main>
        <CTABar />
      </body>
    </html>
  )
}