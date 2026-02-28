import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ConstructRent — Construction Equipment Rental',
    template: '%s | ConstructRent'
  },
  description: 'Rent professional construction equipment online. Excavators, cranes, forklifts and more. Book in minutes.',
  keywords: ['construction equipment', 'equipment rental', 'excavator rental', 'crane rental'],
  openGraph: {
    title: 'ConstructRent — Construction Equipment Rental',
    description: 'Rent professional construction equipment online.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-gray-50 flex flex-col min-h-screen'}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
