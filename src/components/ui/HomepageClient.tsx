'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Equipment = {
  id: string
  name: string
  category: string
  daily_rate: number
  image_url: string
  is_available: boolean
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

const PAIN_POINTS = [
  { num: '01', title: 'The Phone Tag', desc: 'Call 5 suppliers. Leave 3 voicemails. Wait 2 days. Still no equipment.' },
  { num: '02', title: 'The Hidden Costs', desc: 'Quote says ₹50,000. Bill arrives at ₹63,000. No explanation given.' },
  { num: '03', title: 'The Downtime', desc: 'Equipment breaks on day 3. No backup. Project delayed. Money lost.' },
]

const STEPS = [
  { num: '01', title: 'Browse', desc: 'Search by equipment type, location, and availability. Real specs, real prices, no negotiations.' },
  { num: '02', title: 'Book', desc: 'Instant quote in 2 hours. One-click confirm. No calls, no haggling, no paperwork.' },
  { num: '03', title: 'Build', desc: 'Equipment arrives on-site, inspected and ready. Operator included on request.' },
]

const PRICING = [
  { name: 'Excavator (20T)', daily: '₹8,000', weekly: '₹45,000' },
  { name: 'Crane (50T)', daily: '₹15,000', weekly: '₹80,000' },
  { name: 'Bulldozer', daily: '₹12,000', weekly: '₹65,000' },
  { name: 'Forklift', daily: '₹5,000', weekly: '₹28,000' },
  { name: 'Compactor', daily: '₹4,000', weekly: '₹22,000' },
  { name: 'Telehandler', daily: '₹9,000', weekly: '₹52,000' },
]

const divider = { borderTop: '1px solid rgba(255,255,255,0.06)' }

export default function HomepageClient({ equipment, totalEquipment, totalBookings }: {
  equipment: Equipment[]
  totalEquipment: number
  totalBookings: number
}) {
  const [formData, setFormData] = useState({ name: '', email: '', equipment: '' })
  const [formSent, setFormSent] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    await fetch('/api/request-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormSent(true)
    setFormLoading(false)
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '14px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, fontSize: 15, color: '#e8e8e8',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ background: '#080808', color: '#e8e8e8', fontFamily: 'var(--font-geist-sans, -apple-system, "SF Pro Display", Inter, sans-serif)', overflowX: 'hidden' }}>

      {/* Cursor glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244,162,97,0.04) 0%, transparent 70%)`,
      }} />

      {/* Grid texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 24px 80px' }}>
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(244,162,97,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(244,162,97,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 40, background: 'rgba(244,162,97,0.05)', animation: 'fadeUp 0.6s ease forwards' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>Available across India · 2hr response</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-0.04em', marginBottom: 28, maxWidth: 800,
            animation: 'fadeUp 0.6s ease 0.1s both',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Construction Equipment.{' '}
            <span style={{ background: 'linear-gradient(135deg, #f4a261, #e76f51)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Delivered.
            </span>
          </h1>

          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 520, marginBottom: 44, animation: 'fadeUp 0.6s ease 0.2s both' }}>
            Get matched with verified excavators, cranes, and forklifts in under 2 hours. No phone calls, no haggling, no delays.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'fadeUp 0.6s ease 0.3s both' }}>
            <a href="#equipment" style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 0 40px rgba(244,162,97,0.25)', transition: 'all 0.2s' }}>
              Browse Equipment
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <Link href="/contact" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', fontWeight: 600, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
              Get a Quote
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap', animation: 'fadeUp 0.6s ease 0.4s both' }}>
            {[
              { value: `${totalEquipment || 50}+`, label: 'Machines available' },
              { value: `${totalBookings || 200}+`, label: 'Projects completed' },
              { value: '2hr', label: 'Quote response' },
              { value: '5.0★', label: 'Average rating' },
            ].map(stat => (
              <div key={stat.label}>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATIC EQUIPMENT TYPES (replaces marquee) ── */}
      <div style={{ ...divider, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', position: 'relative', zIndex: 1 }}>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Excavators · Cranes · Forklifts · Bulldozers · Compactors · Telehandlers · Compressors
        </p>
      </div>

      {/* ── PROBLEM ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>The Problem</p>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 64, color: '#fff', maxWidth: 500, lineHeight: 1.1 }}>
            Equipment rental is broken.
          </h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.num} delay={i * 100}>
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '32px', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>{p.num}</span>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 120px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>How It Works</p>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 80, color: '#fff', maxWidth: 520, lineHeight: 1.1 }}>
              Three steps. One delivery. Zero friction.
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 120}>
                <div style={{ padding: '48px 40px', background: '#080808', height: '100%', transition: 'background 0.3s' }}>
                  <span style={{ fontSize: 48, fontWeight: 800, color: 'rgba(244,162,97,0.12)', display: 'block', marginBottom: 32, letterSpacing: '-0.04em' }}>{step.num}</span>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.8 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPMENT ── */}
      {equipment.length > 0 && (
        <section id="equipment" style={{ position: 'relative', zIndex: 1, padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Fleet</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>Available now.</h2>
              <Link href="/catalog" style={{ fontSize: 14, color: 'rgba(244,162,97,0.8)', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {equipment.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <Link href={`/catalog/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ aspectRatio: '16/9', background: '#111', overflow: 'hidden' }}>
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚧</div>
                      }
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                      <span style={{ fontSize: 11, color: '#f4a261', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{item.category}</span>
                      <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: '8px 0 4px', letterSpacing: '-0.01em' }}>{item.name}</p>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>₹{item.daily_rate.toLocaleString('en-IN')}/day</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── PRICING ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 120px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
              Simple, transparent pricing.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', marginBottom: 48, lineHeight: 1.7 }}>No subscriptions. No hidden fees. What you see is what you pay.</p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', padding: '14px 24px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Equipment</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'right' }}>Daily</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'right' }}>Weekly</span>
              </div>
              {PRICING.map((row, i) => (
                <div key={row.name} style={{
                  display: 'grid', gridTemplateColumns: '1fr 120px 120px',
                  padding: '18px 24px',
                  borderBottom: i < PRICING.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.2s',
                }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{row.name}</span>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'right' }}>{row.daily}</span>
                  <span style={{ fontSize: 15, color: '#f4a261', textAlign: 'right', fontWeight: 600 }}>{row.weekly}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', marginTop: 14 }}>Transport and operator included. Custom pricing for 30+ day rentals.</p>
            <div style={{ marginTop: 32 }}>
              <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '13px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
                Get an exact quote →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 24px', maxWidth: 800, margin: '0 auto' }}>
        <Reveal>
          <div style={{ borderLeft: '2px solid rgba(244,162,97,0.35)', paddingLeft: 32 }}>
            <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.85, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginBottom: 28 }}>
              "I watched contractors waste 20+ hours a month chasing equipment. So I built a platform to do it in 2 hours."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #f4a261, #e76f51)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>A</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 2 }}>Adib Azam Shaikh</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Founder, ConstructRent</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT FORM ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 120px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Get Started</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
              Need something specific?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', marginBottom: 40, lineHeight: 1.7 }}>Tell us what you need. We respond within 2 hours.</p>
          </Reveal>
          <Reveal delay={100}>
            {formSent ? (
              <div style={{ border: '1px solid rgba(74,222,128,0.25)', borderRadius: 14, padding: '32px', background: 'rgba(74,222,128,0.05)', textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#4ade80', marginBottom: 8 }}>Message sent.</p>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>We will contact you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input required type="text" placeholder="Your name" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} style={input}
                  onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <input required type="email" placeholder="Email address" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} style={input}
                  onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <input required type="text" placeholder="Equipment needed (e.g. 20T Excavator, 2 weeks, Mumbai)" value={formData.equipment}
                  onChange={e => setFormData({ ...formData, equipment: e.target.value })} style={input}
                  onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                  <button type="submit" disabled={formLoading} style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '14px 28px', borderRadius: 10, border: 'none', fontSize: 15, cursor: formLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: formLoading ? 0.6 : 1, transition: 'all 0.2s' }}>
                    {formLoading ? 'Sending...' : 'Send Request →'}
                  </button>
                  <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 14, textDecoration: 'none', padding: '14px 0', fontWeight: 500 }}>
                    Or call us directly →
                  </Link>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '-0.02em' }}>ConstructRent</span>
          <a href="mailto:hello@constructrent.in" style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>hello@constructrent.in</a>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.18)' }}>© 2026</span>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.18); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        h1, h2, h3, p { margin: 0; }
      `}</style>
    </div>
  )
}