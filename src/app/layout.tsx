import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTABar from '@/components/ui/CTABar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ConstructRent — Construction Equipment Rental',
    template: '%s | ConstructRent'
  },
  description: 'Rent professional construction equipment online. Excavators, cranes, forklifts and more. Get a free quote in 2 hours. Serving Mumbai, Gujarat and all of India.',
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
      <body className={inter.className + ' bg-gray-50 flex flex-col min-h-screen'}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CTABar />
      </body>
    </html>
  )
}