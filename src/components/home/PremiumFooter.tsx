'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Mail, Phone } from 'lucide-react'
import { MagneticButton, MotionReveal, TextScramble } from '@/components/motion/motionPrimitives'
import { ADMIN_EMAIL } from '@/lib/constants'

export function PremiumFooter() {
  const [focus, setFocus] = useState(false)

  return (
    <footer className="relative z-10 bg-slate-950 px-6 pb-12 pt-24">
      <MotionReveal>
        <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <p className="font-space-grotesk text-2xl tracking-[-0.02em] text-white">ConstructRent</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Industrial-grade rental operations for teams that need uptime, transparency, and speed.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="text-white">Product</p>
            <Link href="/catalog"><TextScramble text="Fleet" /></Link>
            <Link href="/faq"><TextScramble text="Pricing" /></Link>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="text-white">Company</p>
            <Link href="/about"><TextScramble text="About" /></Link>
            <Link href="/contact"><TextScramble text="Contact" /></Link>
            <a href={`mailto:${ADMIN_EMAIL}`}>{ADMIN_EMAIL}</a>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-white">Newsletter</p>
            <div className="flex gap-2">
              <input
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all"
                style={{ width: focus ? 220 : 150 }}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder="Email"
              />
              <MagneticButton className="rounded-full bg-coral px-4 text-sm font-semibold text-white">
                Subscribe
              </MagneticButton>
            </div>
            <div className="flex gap-3 text-white/70">
              {[Building2, Mail, Phone].map((Icon, idx) => (
                <button key={idx} className="transition hover:scale-110 hover:text-coral" aria-label="Social link">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </MotionReveal>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-4 text-xs text-slate-400">
        © {new Date().getFullYear()} Construct Rent. All rights reserved.
      </div>
    </footer>
  )
}
