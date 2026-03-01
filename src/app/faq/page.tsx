'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    category: 'Booking',
    questions: [
      {
        q: 'How do I rent equipment?',
        a: 'Browse our catalog, select the equipment you need, choose your rental dates, and confirm your booking. You will receive a confirmation email instantly.'
      },
      {
        q: 'Can I cancel or modify my booking?',
        a: 'Yes, you can cancel or modify your booking from your dashboard. Cancellations made 48 hours before the start date are fully refunded.'
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 2-3 days in advance to ensure availability, especially for popular equipment like excavators and cranes.'
      },
      {
        q: 'Can I extend my rental period?',
        a: 'Yes, contact us before your rental ends and we will extend it if the equipment is available. Additional charges apply per day.'
      },
    ]
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        q: 'How is pricing calculated?',
        a: 'All equipment is priced per day. The total is calculated automatically when you select your dates. There are no hidden fees.'
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit/debit cards, UPI, and net banking through our secure Razorpay payment gateway.'
      },
      {
        q: 'Is there a security deposit?',
        a: 'A refundable security deposit may be required for heavy equipment. This will be shown clearly before you confirm your booking.'
      },
      {
        q: 'Do you offer discounts for long-term rentals?',
        a: 'Yes! Rentals of 7 days or more receive a 10% discount, and rentals of 30 days or more receive a 20% discount. Contact us for custom quotes.'
      },
    ]
  },
  {
    category: 'Equipment',
    questions: [
      {
        q: 'Is all equipment insured?',
        a: 'Yes, all equipment on ConstructRent is fully insured. However, renters are responsible for damages caused by misuse or negligence.'
      },
      {
        q: 'Do you provide an operator with the equipment?',
        a: 'Equipment is rented without an operator by default. If you need an operator, contact us and we will arrange one at an additional cost.'
      },
      {
        q: 'What happens if the equipment breaks down?',
        a: 'Call us immediately. We will arrange a replacement or repair as quickly as possible. You will not be charged for downtime caused by equipment failure.'
      },
      {
        q: 'How is equipment delivered?',
        a: 'You can pick up equipment from our depot or we can arrange delivery within Mumbai for an additional fee. Delivery costs depend on distance.'
      },
    ]
  },
  {
    category: 'Account',
    questions: [
      {
        q: 'Do I need an account to rent?',
        a: 'Yes, you need a free account to make bookings. This helps us keep track of your rentals and send you booking confirmations.'
      },
      {
        q: 'How do I view my booking history?',
        a: 'Log in and go to your Dashboard or Profile page. All your past and current bookings are listed there with their status.'
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click "Login" and then "Forgot Password". Enter your email and we will send you a reset link within a few minutes.'
      },
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left gap-4"
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{q}</span>
        <span className={'text-xl flex-shrink-0 transition-transform duration-200 ' + (open ? 'rotate-45' : '')}>
          +
        </span>
      </button>
      {open && (
        <p className="text-gray-500 text-sm leading-relaxed pb-4">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [search, setSearch] = useState('')

  const filtered = FAQS.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
           q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-lg">Everything you need to know about renting with ConstructRent</p>
      </div>

      {/* Search */}
      <div className="relative mb-10">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white shadow-sm"
        />
      </div>

      {/* FAQ sections */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🤔</p>
          <p className="font-medium text-gray-600">No questions found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map(cat => (
            <div key={cat.category} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-3">
                <h2 className="font-bold text-yellow-700 text-sm uppercase tracking-wide">{cat.category}</h2>
              </div>
              <div className="px-6">
                {cat.questions.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Still have questions CTA */}
      <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-center text-white">
        <p className="text-2xl font-bold mb-2">Still have questions?</p>
        <p className="text-gray-400 mb-6">Our team is happy to help you find the right equipment</p>
        <Link
          href="/contact"
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-colors inline-block"
        >
          Contact Us →
        </Link>
      </div>

    </div>
  )
}
