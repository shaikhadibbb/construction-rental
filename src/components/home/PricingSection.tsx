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
  const [flow, setFlow] = useState<'b2c' | 'b2b'>('b2c')
  useReducedMotion()
  const pricing = useMemo(() => plans.map(plan => ({ ...plan, value: mode === 'monthly' ? plan.monthly : plan.yearly })), [mode])

  return (
    <section id="pricing" className="relative z-10 bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
      <MotionReveal>
        <h2 className="font-space-grotesk text-4xl tracking-[-0.02em] text-slate-900">Transparent Pricing</h2>
      </MotionReveal>

      <div className="mt-5 inline-flex rounded-full border border-slate-300 bg-white p-1">
        {(['b2c', 'b2b'] as const).map(item => (
          <button key={item} onClick={() => setFlow(item)} className={`rounded-full px-4 py-2 text-sm font-medium ${flow === item ? 'bg-slate-900 text-white' : 'text-slate-700'}`}>
            {item === 'b2c' ? 'Instant Booking' : 'Enterprise'}
          </button>
        ))}
      </div>

      <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
        {(['monthly', 'yearly'] as const).map(item => (
          <button key={item} onClick={() => setMode(item)} className="relative rounded-full px-4 py-2 text-sm text-slate-800">
            {mode === item && <motion.span layoutId="pricing-switch" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: 'spring', stiffness: 100, damping: 12 }} />}
            <span className="relative z-10 capitalize">{item}</span>
          </button>
        ))}
      </div>

      {flow === 'b2c' ? (
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {pricing.map((plan, index) => (
          <MotionReveal key={plan.name} delay={0.1 * index}>
            <article className={`rounded-2xl border p-8 ${plan.popular ? 'border-coral bg-white shadow-md' : 'border-slate-200 bg-white'}`}>
              {plan.popular && <p className="mb-2 inline-flex rounded-full bg-[#FFD700]/30 px-3 py-1 text-xs font-semibold text-slate-900">Most Popular</p>}
              <p className="text-sm uppercase tracking-[0.14em] text-slate-600">{plan.name}</p>
              <p className="mt-4 font-space-grotesk text-4xl text-slate-900">₹<CountUp target={plan.value} /></p>
              <p className="mt-2 text-sm text-slate-600">{plan.detail}</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Check size={14} /> Instant KYC</li>
                <li className="flex items-center gap-2"><Check size={14} /> ₹0 Security Deposit</li>
                <li className="flex items-center gap-2"><Check size={14} /> 24/7 Support</li>
              </ul>
              <MagneticButton className="mt-8 w-full rounded-xl bg-coral px-4 py-3 text-sm font-semibold text-white">
                Request Quote
              </MagneticButton>
            </article>
          </MotionReveal>
        ))}
      </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-space-grotesk text-2xl text-slate-900">Project Mode (3-12 Month Rentals)</h3>
          <p className="mt-2 text-slate-700">30% lower daily rates with guaranteed monthly minimums and dedicated account manager.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input placeholder="Company Name" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input placeholder="Company GST" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input placeholder="Project Duration (months)" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input placeholder="Site Location" className="rounded-lg border border-slate-300 px-3 py-2" />
          </div>
          <textarea placeholder="Equipment list + quantity requirements" className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2" rows={4} />
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">Quote SLA: 2 hours</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Billing: Net-15</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">GST Invoice Ready</span>
          </div>
          <MagneticButton className="mt-4 rounded-lg bg-coral px-5 py-3 font-semibold text-white">Submit Enterprise Requirement</MagneticButton>
        </div>
      )}
      </div>
    </section>
  )
}
