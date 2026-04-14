'use client'

import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { CountUp, FloatingCard, MotionReveal } from '@/components/motion/motionPrimitives'

export function FeaturesBento() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32">
      <MotionReveal>
        <h2 className="font-space-grotesk text-5xl tracking-[-0.02em] text-white">Why Construct Rent?</h2>
      </MotionReveal>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <FloatingCard className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <span className="text-8xl font-bold text-white/10">02</span>
          <h3 className="mt-2 text-2xl font-semibold text-white">2hr Delivery</h3>
          <p className="mt-3 text-white/70">Live dispatch orchestration with confirmation in less than two hours.</p>
        </FloatingCard>

        <FloatingCard className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <CheckCircle2 className="text-gold" />
          <h3 className="mt-4 text-xl font-semibold text-white">Verified Equipment</h3>
          <p className="mt-2 text-sm text-white/70">Quality-checked machines with maintenance records.</p>
        </FloatingCard>

        <FloatingCard className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <ShieldCheck className="text-gold" />
          <h3 className="mt-4 text-xl font-semibold text-white">Insurance Included</h3>
          <p className="mt-2 text-sm text-white/70">Coverage-ready contracts for enterprise peace of mind.</p>
        </FloatingCard>

        <FloatingCard className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Pan-India Logistics</h3>
          <p className="mt-2 text-sm text-white/70">Mumbai · Ahmedabad · Pune · Delhi NCR · Bengaluru · Hyderabad</p>
        </FloatingCard>

        <FloatingCard className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm text-white/70">Machines</p>
          <p className="font-space-grotesk text-5xl text-white"><CountUp target={500} />+</p>
          <p className="mt-4 text-sm text-white/70">Cities</p>
          <p className="font-space-grotesk text-3xl text-white"><CountUp target={50} />+</p>
        </FloatingCard>
      </div>
    </section>
  )
}
