import type { Metadata } from 'next'
import { Inter_Tight, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTABar from '@/components/ui/CTABar'
import ToastViewport from '@/components/ui/ToastViewport'

const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: {
    default: 'Construct Rent | Premium Construction Equipment Rental',
    template: '%s | Construct Rent'
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
      <body className={`${interTight.variable} ${spaceGrotesk.variable} ${interTight.className}`} style={{ background: 'var(--background)', margin: 0, padding: 0 }}>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <CTABar />
        <ToastViewport />
      </body>
    </html>
  )
}