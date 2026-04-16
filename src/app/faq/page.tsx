'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CALL_NUMBER } from '@/lib/constants'

const FAQS = [
  {
    category: 'Booking',
    questions: [
      { q: 'How do I rent equipment?', a: 'Browse our catalog, select the equipment you need, fill in your project details and rental dates, and submit a quote request. Our team responds within 2 hours with pricing and availability.' },
      { q: 'Can I cancel or modify my booking?', a: 'Yes, you can cancel from your dashboard. Cancellations made 48 hours before the start date are fully refunded. To modify dates, contact us directly.' },
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 2–3 days in advance to ensure availability, especially for popular equipment like excavators and cranes during peak season.' },
      { q: 'Can I extend my rental period?', a: 'Yes, contact us before your rental ends and we will extend it if the equipment is available. Additional charges apply per day at the same rate.' },
    ]
  },
  {
    category: 'Pricing',
    questions: [
      { q: 'How is pricing calculated?', a: 'All equipment is priced per day. The total is calculated based on your rental period. There are no hidden fees — the price you see is the price you pay.' },
      { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, and net banking through our secure payment gateway.' },
      { q: 'Is there a security deposit?', a: 'A refundable security deposit may be required for heavy equipment. This will be shown clearly before you confirm your booking.' },
      { q: 'Do you offer discounts for long-term rentals?', a: 'Yes. Rentals of 7+ days receive a 10% discount, and 30+ days receive a 20% discount. Contact us for custom quotes on large projects.' },
    ]
  },
  {
    category: 'Equipment',
    questions: [
      { q: 'Is all equipment insured?', a: 'Yes, all equipment on ConstructRent is fully insured. Renters are responsible for damages caused by misuse or negligence during the rental period.' },
      { q: 'Do you provide an operator?', a: 'Equipment is rented without an operator by default. If you need a certified operator, contact us and we will arrange one at an additional cost.' },
      { q: 'What happens if the equipment breaks down?', a: 'Call us immediately. We will arrange a replacement or repair as quickly as possible. You will not be charged for downtime caused by equipment failure on our end.' },
      { q: 'How is equipment delivered?', a: 'We deliver directly to your construction site across Mumbai and surrounding areas. Delivery costs depend on distance and are confirmed in your quote.' },
    ]
  },
  {
    category: 'Account',
    questions: [
      { q: 'Do I need an account to rent?', a: 'You can submit a quote request without an account. However, creating a free account lets you track your bookings, view history, and manage rentals from your dashboard.' },
      { q: 'How do I view my booking history?', a: 'Log in and go to your Dashboard. All your past and current bookings are listed there with their status and details.' },
      { q: 'I forgot my password. What do I do?', a: 'Click "Login" then "Forgot Password". Enter your email and we will send you a reset link within a few minutes.' },
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="cr-faq-last">
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 0', textAlign: 'left', gap: 16, background: 'none', border: 'none', cursor: 'pointer',
      }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: open ? '#f4a261' : 'rgba(255,255,255,0.8)', transition: 'color 0.2s', lineHeight: 1.5, fontFamily: 'inherit' }}>
          {q}
        </span>
        <div style={{
          width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: open ? '#f4a261' : 'rgba(255,255,255,0.07)', transition: 'all 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>
          <svg width="10" height="10" fill="none" stroke={open ? '#0a0a0a' : 'rgba(255,255,255,0.5)'} strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>
      {open && (
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.8, paddingBottom: 20, paddingRight: 40 }}>{a}</p>
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
      q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0 && (activeCategory === 'All' || cat.category === activeCategory))

  const totalQuestions = FAQS.reduce((s, c) => s + c.questions.length, 0)

  return (
    <div className="ui-page-shell" style={{ color: '#e8e8e8', fontFamily: 'var(--font-geist-sans, -apple-system, Inter, sans-serif)' }}>


      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '72px 24px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>{totalQuestions} questions answered</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12, lineHeight: 1.05 }}>
            Frequently asked questions.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>Everything you need to know about renting with ConstructRent.</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(255,255,255,0.25)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '13px 16px 13px 44px', fontSize: 15, color: '#e8e8e8', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Category tabs */}
        {!search && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {['All', ...FAQS.map(c => c.category)].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                background: activeCategory === cat ? '#f4a261' : 'rgba(255,255,255,0.06)',
                color: activeCategory === cat ? '#0a0a0a' : 'rgba(255,255,255,0.45)',
              }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQs */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🤔</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>No questions found</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(cat => (
              <div key={cat.category} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{cat.category}</p>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{cat.questions.length} questions</span>
                </div>
                <div style={{ padding: '0 24px' }}>
                  {cat.questions.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 48, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '48px 32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(244,162,97,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em', position: 'relative' }}>Still have questions?</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 28, position: 'relative', lineHeight: 1.7 }}>Our team is happy to help you find the right equipment for your project.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/contact" style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
              Contact Us →
            </Link>
            <a href={`tel:${CALL_NUMBER}`} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
              Call Us
            </a>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.18); }
        .cr-faq-last:last-child { border-bottom: none !important; }
      `}</style>
    </div>
  )
}