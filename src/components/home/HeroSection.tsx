'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Play } from 'lucide-react'
import { MagneticButton, MotionReveal } from '@/components/motion/motionPrimitives'

const words = ['Heavy', 'Equipment.', 'Zero', 'Friction.']

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(120deg,#0F172A,#1f2d46,#FF6B4A,#FFD700)] bg-[length:250%_250%] animate-mesh-gradient" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '3px 3px' }} />

      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <MotionReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-xl">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Available across India
            </div>
          </MotionReveal>

          <h1 className="mt-7 font-space-grotesk text-6xl font-bold tracking-[-0.02em] text-white md:text-8xl">
            {words.map((word, index) => (
              <motion.span
                key={word}
                className="mr-3 inline-block"
                initial={reduceMotion ? false : { opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 100, damping: 12, delay: index * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <MotionReveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-xl text-white/70">
              Rent verified excavators, cranes, and lifts in under 2 hours. Fully insured. Pan-India logistics.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.5}>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton className="rounded-xl bg-coral px-6 py-3 font-semibold text-white shadow-glow-coral">
                <Link href="/catalog">Explore Fleet</Link>
              </MagneticButton>
              <MagneticButton className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-xl">
                <Play size={16} />
                <Link href="#video-demo">Watch Demo</Link>
              </MagneticButton>
            </div>
          </MotionReveal>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="absolute h-80 w-80 rounded-full bg-coral/30 blur-3xl" />
          <div className="absolute right-8 top-20 h-48 w-48 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl" />
          <div className="absolute bottom-20 left-8 h-64 w-56 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl" />
        </div>
      </div>
    </section>
  )
}
