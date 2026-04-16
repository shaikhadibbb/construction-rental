'use client'

import Link from 'next/link'
import { ShieldCheck, HardHat, BadgeCheck, Wrench } from 'lucide-react'
import { MagneticButton, MotionReveal } from '@/components/motion/motionPrimitives'

export function HeroSection() {
  return (
    <section
      className="relative min-h-[88vh] overflow-hidden px-6 pb-20 pt-20"
      style={{
        backgroundImage:
          'linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.82)), url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2200&q=70)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12">
        <div>
          <MotionReveal delay={0.1}>
            <div className="mb-5 w-fit rounded-xl border border-white/20 bg-white/10 p-2">
              <label htmlFor="hero-city" className="sr-only">Select your city</label>
              <select id="hero-city" className="rounded-md border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-white">
                {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map(city => <option key={city}>{city}</option>)}
              </select>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.2}>
            <h1 className="font-space-grotesk text-4xl font-bold tracking-[-0.02em] text-white md:text-7xl">
              Same-Day Equipment Delivery — Book Online in 2 Minutes
            </h1>
          </MotionReveal>

          <MotionReveal delay={0.4}>
            <p className="mt-5 max-w-3xl text-lg text-white/85 md:text-xl font-medium">
              Fleet ready. On-site fast. Zero downtime.
            </p>
            <p className="mt-2 max-w-3xl text-base text-white/75">
              Verified excavators, cranes, and lifts dispatched to your job site instantly. No more phone-tag.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.5}>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton className="rounded-xl bg-coral px-6 py-3 font-semibold text-white shadow-glow-coral">
                <Link href="/catalog">Check Availability</Link>
              </MagneticButton>
              <MagneticButton className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-transparent px-6 py-3 font-medium text-white">
                <Link href="#equipment">View Equipment Specs</Link>
              </MagneticButton>
              <a
                href="https://wa.me/919999999999?text=Need%20equipment%20quote%20for%20my%20construction%20site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl border border-white/40 bg-black/20 px-6 py-3 text-sm font-medium text-white"
              >
                Get Quote on WhatsApp
              </a>
            </div>
          </MotionReveal>

          <div className="mt-8 grid gap-3 text-sm text-white md:grid-cols-2">
            {[
              { label: 'OSHA & DOT Certified Fleet', Icon: BadgeCheck },
              { label: 'Fully Licensed & Insured ($5M)', Icon: ShieldCheck },
              { label: 'Google 5-Star Rated (150+ Reviews)', Icon: HardHat },
              { label: 'Free Delivery within 30 Miles', Icon: Wrench },
            ].map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/25 px-3 py-2">
                <Icon size={16} className="text-[#4ade80]" />
                <span className="font-medium text-white">{label}</span>
              </div>
            ))}
          </div>

          <MotionReveal delay={0.6}>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-md md:w-max">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                📍
              </div>
              <div>
                <p className="text-sm font-bold text-white">We Deliver to Your Job Site</p>
                <p className="text-xs text-white/60">HQ: 124 Industrial Pkwy, Mumbai • Radius: 50km</p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  )
}
