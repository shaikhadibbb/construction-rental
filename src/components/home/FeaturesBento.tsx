'use client'

import { Truck, CalendarCheck2, BadgeIndianRupee, HardHat, ShieldCheck, Wrench } from 'lucide-react'
import { FloatingCard, MotionReveal } from '@/components/motion/motionPrimitives'

export function FeaturesBento() {
  return (
    <section className="relative z-10 py-24" id="how-it-works" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="mx-auto w-full max-w-7xl px-6">
        <MotionReveal>
          <p style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Zero Phone-Tag</p>
          <h2 className="font-space-grotesk" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05, marginBottom: 40 }}>How It Works</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { title: 'Select Equipment & Dates', Icon: CalendarCheck2, desc: 'Browse 50+ verified machines.' },
            { title: 'Get Instant Quote & Pay 10%', Icon: BadgeIndianRupee, desc: 'No hidden fees, ever.' },
            { title: 'We Deliver to Your Site', Icon: Truck, desc: 'GPS tracking included.' },
            { title: 'Operator Included', Icon: HardHat, desc: 'Certified + police verified.' },
          ].map(({ title, Icon, desc }, index) => (
            <MotionReveal key={title} delay={index * 0.05}>
              <FloatingCard className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', height: '100%' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,107,44,0.1)', border: '1px solid rgba(255,107,44,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon className="text-coral" size={18} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
              </FloatingCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-7xl px-6">
        <MotionReveal>
          <h2 className="font-space-grotesk" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05, marginBottom: 24 }}>Safety & Compliance</h2>
        </MotionReveal>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            { item: 'All equipment inspected every 100 engine hours', Icon: Wrench },
            { item: 'Certified operators with 5+ years experience', Icon: HardHat },
            { item: 'Comprehensive damage waiver included', Icon: ShieldCheck },
            { item: 'ISO / OHSAS process compliance verified', Icon: ShieldCheck },
          ].map(({ item, Icon }, index) => (
            <MotionReveal key={item} delay={index * 0.06}>
              <FloatingCard className="rounded-2xl p-5" style={{ background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.1)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-3">
                  <Icon size={18} style={{ color: '#ffd700', flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item}</p>
                </div>
              </FloatingCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      <div id="cities" className="mx-auto mt-16 w-full max-w-7xl px-6">
        <MotionReveal>
          <h3 className="font-space-grotesk" style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 14 }}>Fleet Categories</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Excavators', 'Cranes', 'Forklifts', 'Loaders', 'Compactors', 'Boom Lifts', 'Generators'].map(cat => (
              <a key={cat} href="/catalog" style={{ fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '6px 16px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'all 0.2s' }}>
                {cat}
              </a>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
