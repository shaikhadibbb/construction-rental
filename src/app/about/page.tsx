import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'ConstructRent was founded in Mumbai to make construction equipment rental simple, transparent, and fast for every contractor in India.',
}

const STATS = [
  { value: '50+', label: 'Machines available' },
  { value: '200+', label: 'Projects completed' },
  { value: '2hr', label: 'Quote response' },
  { value: '5.0★', label: 'Average rating' },
]

const VALUES = [
  { title: 'Transparent pricing', desc: 'What you see is what you pay. No hidden fees, no surprise charges, ever.' },
  { title: 'Fast response', desc: 'Submit a quote request and hear back within 2 hours. No waiting, no phone tag.' },
  { title: 'Verified equipment', desc: 'Every machine undergoes a 50-point inspection before it arrives on your site.' },
  { title: 'Reliable support', desc: 'Our team is available 6 days a week for any questions or on-site issues.' },
]

const TIMELINE = [
  { year: '2024', event: 'Founded in Mumbai with 5 pieces of equipment and a big vision.' },
  { year: '2025', event: 'Expanded to 50+ machines across 6 categories, serving contractors city-wide.' },
  { year: '2026', event: 'Launched online quote platform — request equipment in minutes, not days.' },
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e8e8e8', fontFamily: 'var(--font-geist-sans, -apple-system, Inter, sans-serif)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Hero */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '100px 24px 72px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(244,162,97,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>Our Story</p>
          <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 24, background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.55) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Built for builders.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 560 }}>
            ConstructRent was born from a simple frustration — renting construction equipment should be as easy as ordering anything else online. No middlemen, no paperwork, just the right equipment on time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px', position: 'relative', zIndex: 1, background: 'rgba(244,162,97,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
          {STATS.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 36, fontWeight: 800, color: '#f4a261', marginBottom: 6, letterSpacing: '-0.03em' }}>{stat.value}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="cr-story-grid">
          <div>
            <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>From frustration to solution</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 24, lineHeight: 1.15 }}>
              Why we built this.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
              <p>ConstructRent started in Mumbai in 2024 when our founder Adib noticed that small and medium contractors were spending 20+ hours a month just chasing equipment — calling dealers, negotiating prices, dealing with unreliable deliveries.</p>
              <p>We built a platform that puts contractors in control. Browse real equipment, see real prices, request a quote, and get back to building.</p>
              <p>Today we serve hundreds of contractors across Mumbai with a growing fleet of excavators, cranes, forklifts, compactors, and more.</p>
            </div>
            <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '13px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
              Browse our fleet →
            </Link>
          </div>

          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((item, i) => (
              <div key={item.year} style={{ display: 'flex', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#f4a261', flexShrink: 0 }}>{item.year}</div>
                  {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />}
                </div>
                <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 36 : 0, paddingTop: 10 }}>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 24px 100px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Our Values</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 56, lineHeight: 1.1 }}>What we stand for.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {VALUES.map((v, i) => (
              <div key={v.title} className="cr-value-card" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(244,162,97,0.6)', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>0{i + 1}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ borderLeft: '2px solid rgba(244,162,97,0.35)', paddingLeft: 32 }}>
            <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', lineHeight: 1.85, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginBottom: 28 }}>
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
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px 100px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12, lineHeight: 1.1 }}>
            Ready to build something great?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', marginBottom: 36, lineHeight: 1.7 }}>
            Join hundreds of contractors who trust ConstructRent for their equipment needs.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/catalog" style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
              Browse Equipment →
            </Link>
            <Link href="/contact" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15, border: '1px solid rgba(255,255,255,0.1)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) { .cr-story-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }
        .cr-value-card:hover { border-color: rgba(244,162,97,0.2) !important; background: rgba(244,162,97,0.03) !important; }
      `}</style>
    </div>
  )
}