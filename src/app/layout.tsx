import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTABar from '@/components/ui/CTABar'
import ToastViewport from '@/components/ui/ToastViewport'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter-tight' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  metadataBase: new URL('https://constructrent.in'),
  title: {
    default: 'Construct Rent | Premium Construction Equipment Rental',
    template: '%s | Construct Rent'
  },
  description: 'Rent professional construction equipment across India. Excavators, cranes, forklifts and more. Get a free quote in 2 hours. Serving Mumbai, Ahmedabad, Gujarat and all of India.',
  keywords: ['construction equipment rental', 'excavator rental', 'crane rental', 'forklift rental', 'JCB rental', 'equipment hire India'],
  openGraph: {
    title: 'Construct Rent | Excavator & Crane Rental',
    description: 'Rent excavators and cranes quickly with insured equipment and certified operators.',
    type: 'website',
    siteName: 'ConstructRent',
    images: ['/og-construct-rent.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construct Rent | Excavator & Crane Rental',
    description: 'Rent excavators and cranes quickly with insured equipment and certified operators.',
    images: ['/og-construct-rent.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className}`} style={{ background: 'var(--background)', margin: 0, padding: 0 }}>
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