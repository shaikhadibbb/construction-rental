'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    category: 'Booking',
    icon: '📅',
    questions: [
      { q: 'How do I rent equipment?', a: 'Browse our catalog, select the equipment you need, fill in your project details and rental dates, and submit a quote request. Our team responds within 2 hours with pricing and availability.' },
      { q: 'Can I cancel or modify my booking?', a: 'Yes, you can cancel from your dashboard. Cancellations made 48 hours before the start date are fully refunded. To modify dates, contact us directly.' },
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 2–3 days in advance to ensure availability, especially for popular equipment like excavators and cranes during peak season.' },
      { q: 'Can I extend my rental period?', a: 'Yes, contact us before your rental ends and we will extend it if the equipment is available. Additional charges apply per day at the same rate.' },
    ]
  },
  {
    category: 'Pricing & Payment',
    icon: '💰',
    questions: [
      { q: 'How is pricing calculated?', a: 'All equipment is priced per day. The total is calculated based on your rental period. There are no hidden fees — the price you see is the price you pay.' },
      { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, and net banking through our secure payment gateway.' },
      { q: 'Is there a security deposit?', a: 'A refundable security deposit may be required for heavy equipment. This will be shown clearly before you confirm your booking.' },
      { q: 'Do you offer discounts for long-term rentals?', a: 'Yes! Rentals of 7 days or more receive a 10% discount, and rentals of 30 days or more receive a 20% discount. Contact us for custom quotes on large projects.' },
    ]
  },
  {
    category: 'Equipment',
    icon: '🚧',
    questions: [
      { q: 'Is all equipment insured?', a: 'Yes, all equipment on ConstructRent is fully insured. However, renters are responsible for damages caused by misuse or negligence during the rental period.' },
      { q: 'Do you provide an operator with the equipment?', a: 'Equipment is rented without an operator by default. If you need a certified operator, contact us and we will arrange one at an additional cost.' },
      { q: 'What happens if the equipment breaks down?', a: 'Call us immediately. We will arrange a replacement or repair as quickly as possible. You will not be charged for downtime caused by equipment failure on our end.' },
      { q: 'How is equipment delivered?', a: 'We deliver directly to your construction site across Mumbai and surrounding areas. Delivery costs depend on distance and are confirmed in your quote.' },
    ]
  },
  {
    category: 'Account',
    icon: '👤',
    questions: [
      { q: 'Do I need an account to rent?', a: 'You can submit a quote request without an account. However, creating a free account lets you track your bookings, view history, and manage rentals from your dashboard.' },
      { q: 'How do I view my booking history?', a: 'Log in and go to your Dashboard. All your past and current bookings are listed there with their status and details.' },
      { q: 'I forgot my password. What should I do?', a: 'Click "Login" and then "Forgot Password". Enter your email and we will send you a reset link within a few minutes.' },
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left gap-4 group">
        <span className={`font-semibold text-sm sm:text-base transition-colors ${open ? 'text-yellow-600' : 'text-gray-900 group-hover:text-yellow-600'}`}>
          {q}
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${open ? 'bg-yellow-500 rotate-45' : 'bg-gray-100 group-hover:bg-yellow-50'}`}>
          <svg className={`w-3 h-3 ${open ? 'text-[#0a1628]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>
      {open && (
        <p className="text-gray-500 text-sm leading-relaxed pb-4 pr-10">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = FAQS.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
           q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat =>
    cat.questions.length > 0 &&
    (activeCategory === 'All' || cat.category === activeCategory)
  )

  const totalQuestions = FAQS.reduce((s, c) => s + c.questions.length, 0)

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="bg-[#0a1628] relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px)'}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-yellow-400 text-sm font-semibold tracking-wide">{totalQuestions} QUESTIONS ANSWERED</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Frequently Asked <span className="text-yellow-500">Questions</span>
          </h1>
          <p className="text-gray-400 text-lg">Everything you need to know about renting with ConstructRent</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Category filter */}
        {!search && (
          <div className="flex gap-2 flex-wrap mb-8">
            {['All', ...FAQS.map(c => c.category)].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat ? 'bg-[#0a1628] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ sections */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-4xl mb-3">🤔</p>
            <p className="font-bold text-gray-700">No questions found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(cat => (
              <div key={cat.category} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="font-black text-[#0a1628] text-sm uppercase tracking-wider">{cat.category}</h2>
                  <span className="ml-auto text-xs text-gray-400 font-medium">{cat.questions.length} questions</span>
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

        {/* CTA */}
        <div className="mt-10 bg-[#0a1628] rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-2xl font-black text-white mb-2">Still have questions?</p>
            <p className="text-gray-400 mb-6 text-sm">Our team is happy to help you find the right equipment for your project</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-8 py-3 rounded-xl transition-colors inline-block text-sm">
                Contact Us →
              </Link>
              <a href="tel:+919876543210"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-block text-sm">
                📞 Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}