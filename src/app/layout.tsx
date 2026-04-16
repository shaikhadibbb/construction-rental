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
    default: 'ConstructRent — Same-Day Equipment Delivery & Rental',
    template: '%s | ConstructRent'
  },
  description: 'Rent verified excavators, cranes, and heavy construction equipment. Same-day delivery, fully insured fleet ($5M coverage), and 24/7 breakdown support across India.',
  keywords: ['heavy equipment rental', 'excavator rental', 'crane rental near me', 'B2B construction tools', 'same-day equipment delivery', 'rent JCB India'],
  openGraph: {
    title: 'ConstructRent: Same-Day Heavy Equipment Rental',
    description: 'Rent verified excavators and cranes with guaranteed on-site delivery and 24/7 support.',
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