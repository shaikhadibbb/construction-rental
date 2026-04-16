'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { CountUp, MagneticButton, MotionReveal } from '@/components/motion/motionPrimitives'

const plans = [
  {
    name: 'Day Pass',
    monthly: 0,
    yearly: 0,
    detail: 'For one-time project rentals',
    popular: false,
    features: ['Instant Booking', 'Any equipment', '24/7 breakdown support', 'Same-day delivery', 'Pay-per-use'],
    cta: 'Browse Equipment',
    ctaHref: '/catalog',
    priceLabel: 'Free to use',
  },
  {
    name: 'Business',
    monthly: 2999,
    yearly: 29990,
    detail: 'For growing contractors',
    popular: true,
    features: ['Everything in Day Pass', 'Priority fleet access', 'Dedicated account manager', 'Net-15 billing', 'GST invoice ready', 'Volume discounts (10–30%)'],
    cta: 'Book Online in 2 Minutes',
    ctaHref: '/contact',
    priceLabel: '/month',
  },
  {
    name: 'Enterprise',
    monthly: 9999,
    yearly: 99990,
    detail: 'For national operations',
    popular: false,
    features: ['Everything in Business', 'Custom fleet contracts', 'On-site coordinator', 'API integration', 'Quarterly reviews', 'SLA guarantee'],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    priceLabel: '/month',
  },
]

export function PricingSection() {
  const [mode, setMode] = useState<'monthly' | 'yearly'>('monthly')
  const [flow, setFlow] = useState<'b2c' | 'b2b'>('b2c')
  const pricing = useMemo(() => plans.map(plan => ({ ...plan, value: mode === 'monthly' ? plan.monthly : plan.yearly })), [mode])

  return (
    <section id="pricing" className="relative z-10 py-24" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="mx-auto w-full max-w-7xl px-6">
        <MotionReveal>
          <div style={{ marginBottom: 48, maxWidth: 600 }}>
            <p style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Transparent Pricing</p>
            <h2 className="font-space-grotesk" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05 }}>Same-Day Delivery —<br />Book Online in 2 Minutes.</h2>
            <p style={{ marginTop: 14, fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7 }}>Verified excavators, cranes, and lifts dispatched to your job site. No hidden fees. No phone-tag.</p>
          </div>
        </MotionReveal>

        {/* Flow Toggle */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: 4, width: 'fit-content', marginBottom: 32 }}>
          {(['b2c', 'b2b'] as const).map(item => (
            <button key={item} onClick={() => setFlow(item)}
              style={{ borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                background: flow === item ? 'linear-gradient(120deg, var(--accent), var(--accent-hover))' : 'transparent',
                color: flow === item ? '#0a0a0a' : 'rgba(255,255,255,0.5)',
                boxShadow: flow === item ? 'var(--shadow-neon)' : 'none',
              }}>
              {item === 'b2c' ? 'Instant Booking' : 'Enterprise / B2B'}
            </button>
          ))}
        </div>

        {/* Billing Toggle */}
        {flow === 'b2c' && (
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: 4, marginBottom: 40, gap: 2 }}>
            {(['monthly', 'yearly'] as const).map(item => (
              <button key={item} onClick={() => setMode(item)} style={{ position: 'relative', borderRadius: 100, padding: '6px 18px', fontSize: 13, cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                background: mode === item ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: mode === item ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: mode === item ? 700 : 500,
              }}>
                {mode === item && <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span style={{ position: 'relative', zIndex: 1, textTransform: 'capitalize' }}>{item}</span>
                {item === 'yearly' && <span style={{ fontSize: 10, marginLeft: 5, color: '#4ade80', fontWeight: 700 }}>–17%</span>}
              </button>
            ))}
          </div>
        )}

        {flow === 'b2c' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pricing.map((plan, index) => (
              <MotionReveal key={plan.name} delay={0.1 * index}>
                <article
                  style={{
                    borderRadius: 'var(--radius-global)',
                    border: plan.popular ? '1px solid rgba(255,107,44,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    background: plan.popular ? 'rgba(255,107,44,0.07)' : 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(12px)',
                    padding: '36px 28px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: plan.popular ? 'var(--shadow-neon)' : 'none',
                    height: '100%',
                  }}
                >
                  {plan.popular && (
                    <>
                      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 280, height: 120, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,107,44,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                      <span style={{ display: 'inline-flex', marginBottom: 16, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))', color: '#0a0a0a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Most Popular</span>
                    </>
                  )}
                  <p style={{ fontSize: 11, color: plan.popular ? 'var(--accent)' : 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12 }}>{plan.name}</p>
                  {plan.monthly === 0 ? (
                    <p className="font-space-grotesk" style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>Free</p>
                  ) : (
                    <p className="font-space-grotesk" style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>₹<CountUp target={mode === 'monthly' ? plan.monthly : plan.yearly} /><span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>{plan.priceLabel}</span></p>
                  )}
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.5 }}>{plan.detail}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: plan.popular ? 'rgba(255,107,44,0.2)' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={10} color={plan.popular ? '#ff6b2c' : '#fff'} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.ctaHref}
                    style={{
                      display: 'block', width: '100%', borderRadius: 12, padding: '14px', textAlign: 'center', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s',
                      background: plan.popular ? 'linear-gradient(120deg, var(--accent), var(--accent-hover))' : 'rgba(255,255,255,0.06)',
                      color: plan.popular ? '#0a0a0a' : '#fff',
                      border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: plan.popular ? 'var(--shadow-neon)' : 'none',
                    }}
                  >
                    {plan.cta}
                  </a>
                </article>
              </MotionReveal>
            ))}
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-global)', padding: 32, backdropFilter: 'blur(12px)' }}>
            <h3 className="font-space-grotesk" style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Project Mode (3–12 Month Rentals)</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>30% lower rates with guaranteed monthly minimums and a dedicated account manager.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
              {['Company Name', 'Company GST', 'Project Duration (months)', 'Site Location'].map(ph => (
                <input key={ph} placeholder={ph} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#fff', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
              ))}
            </div>
            <textarea placeholder="Equipment list + quantity requirements" rows={4}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#fff', fontFamily: 'inherit', outline: 'none', resize: 'vertical', marginBottom: 16, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {['Quote SLA: 2 hours', 'Billing: Net-15', 'GST Invoice Ready', 'Dedicated Account Manager'].map(tag => (
                <span key={tag} style={{ fontSize: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '5px 12px', color: 'rgba(255,255,255,0.6)' }}>{tag}</span>
              ))}
            </div>
            <MagneticButton className="rounded-xl px-6 py-3 font-semibold text-white" style={{ background: 'linear-gradient(120deg, var(--accent), var(--accent-hover))', fontSize: 14, boxShadow: 'var(--shadow-neon)' }}>Submit Enterprise Requirement →</MagneticButton>
          </div>
        )}
      </div>
    </section>
  )
}
