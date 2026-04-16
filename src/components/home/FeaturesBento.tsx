'use client'

import { Truck, CalendarCheck2, BadgeIndianRupee, HardHat, ShieldCheck, Wrench } from 'lucide-react'
import { FloatingCard, MotionReveal } from '@/components/motion/motionPrimitives'

export function FeaturesBento() {
  return (
    <section className="relative z-10 bg-slate-50 py-20">
      <div id="how-it-works" className="mx-auto w-full max-w-7xl px-6">
        <MotionReveal>
          <h2 className="font-space-grotesk text-4xl tracking-[-0.02em] text-slate-900">How It Works</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { title: 'Select Equipment & Dates', Icon: CalendarCheck2 },
            { title: 'Get Instant Quote & Pay 10%', Icon: BadgeIndianRupee },
            { title: 'We Deliver to Your Site', Icon: Truck },
            { title: 'Operator Included (if applicable)', Icon: HardHat },
          ].map(({ title, Icon }, index) => (
            <MotionReveal key={title} delay={index * 0.05}>
              <FloatingCard className="rounded-2xl border border-slate-200 bg-white p-5">
                <Icon className="text-coral" size={18} />
                <p className="mt-3 text-sm font-medium text-slate-800">{title}</p>
                {title === 'We Deliver to Your Site' && <p className="mt-1 text-xs text-slate-500">GPS tracking included.</p>}
              </FloatingCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-7xl px-6">
        <MotionReveal>
          <h2 className="font-space-grotesk text-4xl tracking-[-0.02em] text-slate-900">Safety &amp; Compliance</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            { item: 'All equipment inspected every 100 hours', Icon: Wrench },
            { item: 'Certified operators with 5+ years experience', Icon: HardHat },
            { item: 'Comprehensive damage waiver included', Icon: ShieldCheck },
            { item: 'ISO / OHSAS process compliance', Icon: ShieldCheck },
          ].map(({ item, Icon }, index) => (
            <MotionReveal key={item} delay={index * 0.06}>
              <FloatingCard className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <Icon className="text-[#FFD700]" size={18} />
                  <p className="text-sm text-slate-800">{item}</p>
                </div>
              </FloatingCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      <div id="cities" className="mx-auto mt-16 w-full max-w-7xl px-6">
        <h3 className="font-space-grotesk text-2xl text-slate-900">Fleet Categories</h3>
        <p className="mt-3 text-sm text-slate-700">
          Excavators | Cranes | Forklifts | Loaders | Compactors | Boom Lifts | Generators
        </p>
      </div>
    </section>
  )
}
