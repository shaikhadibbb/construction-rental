import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about renting construction equipment with ConstructRent — booking, pricing, delivery, and more.',
  openGraph: {
    title: 'Frequently Asked Questions | ConstructRent',
    description: 'Everything you need to know about renting equipment with ConstructRent.',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}