'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { CountUp, MagneticButton, MotionReveal } from '@/components/motion/motionPrimitives'

const plans = [
  { name: 'Starter', monthly: 9999, yearly: 99999, detail: 'For single-site teams', popular: false },
  { name: 'Business', monthly: 29999, yearly: 299999, detail: 'For scaling contractors', popular: true },
  { name: 'Enterprise', monthly: 79999, yearly: 799999, detail: 'For national operations', popular: false },
]

export function PricingSection() {
  const [mode, setMode] = useState<'monthly' | 'yearly'>('monthly')
  const reduceMotion = useReducedMotion()
  const pricing = useMemo(() => plans.map(plan => ({ ...plan, value: mode === 'monthly' ? plan.monthly : plan.yearly })), [mode])

  return (
    <section id="pricing" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32">
      <MotionReveal>
        <h2 className="font-space-grotesk text-5xl tracking-[-0.02em] text-white">Transparent Pricing</h2>
      </MotionReveal>

      <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
        {(['monthly', 'yearly'] as const).map(item => (
          <button key={item} onClick={() => setMode(item)} className="relative rounded-full px-4 py-2 text-sm text-white">
            {mode === item && <motion.span layoutId="pricing-switch" className="absolute inset-0 rounded-full bg-white/15" transition={{ type: 'spring', stiffness: 100, damping: 12 }} />}
            <span className="relative z-10 capitalize">{item}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {pricing.map((plan, index) => (
          <MotionReveal key={plan.name} delay={0.1 * index}>
            <motion.article
              onMouseMove={event => {
                if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return
                const el = event.currentTarget
                const rect = el.getBoundingClientRect()
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10
                el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) ${plan.popular ? 'translateY(-12px)' : ''}`
              }}
              onMouseLeave={event => {
                event.currentTarget.style.transform = plan.popular ? 'perspective(1000px) translateY(-12px)' : 'perspective(1000px)'
              }}
              className={`rounded-3xl border p-8 backdrop-blur-xl transition ${plan.popular ? 'border-coral bg-white/10 shadow-[0_0_40px_rgba(255,107,74,0.35)]' : 'border-white/15 bg-white/5'}`}
              style={{ transformStyle: 'preserve-3d', willChange: 'transform', transform: plan.popular ? 'perspective(1000px) translateY(-12px)' : 'perspective(1000px)' }}
            >
              {plan.popular && <p className="mb-2 inline-flex rounded-full bg-gold px-3 py-1 text-xs font-semibold text-slate-900">Most Popular</p>}
              <p className="text-sm uppercase tracking-[0.14em] text-slate-300">{plan.name}</p>
              <p className="mt-4 font-space-grotesk text-4xl text-white">₹<CountUp target={plan.value} /></p>
              <p className="mt-2 text-sm text-slate-300">{plan.detail}</p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><Check size={14} /> Instant KYC</li>
                <li className="flex items-center gap-2"><Check size={14} /> ₹0 Security Deposit</li>
                <li className="flex items-center gap-2"><Check size={14} /> 24/7 Support</li>
              </ul>
              <MagneticButton className="mt-8 w-full rounded-xl bg-coral px-4 py-3 text-sm font-semibold text-white">
                Start Plan
              </MagneticButton>
            </motion.article>
          </MotionReveal>
        ))}
      </div>
    </section>
  )
}
