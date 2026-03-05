import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the ConstructRent team. We respond to all enquiries within 24 hours. Call, email, or send us a message.',
  openGraph: {
    title: 'Contact ConstructRent',
    description: 'Reach our team for equipment enquiries, pricing, and support.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}