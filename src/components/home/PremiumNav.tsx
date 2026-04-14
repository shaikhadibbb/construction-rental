'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'
import { TextScramble } from '@/components/motion/motionPrimitives'

const links = [
  { href: '/catalog', label: 'Equipment' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function PremiumNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { user } = useUser()

  return (
    <>
      <header className="fixed left-1/2 top-6 z-40 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 px-2">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-3 shadow-glass backdrop-blur-xl">
          <Link href="/" className="inline-flex items-center gap-2">
            <motion.svg width="32" height="32" viewBox="0 0 32 32" className="text-coral">
              <motion.path
                d="M22 7h-8a7 7 0 0 0 0 14h5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
              <motion.path
                d="M18 9h5a5 5 0 0 1 0 10h-5v6"
                fill="none"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
            </motion.svg>
            <span className="font-space-grotesk text-sm tracking-tight text-white">Construct Rent</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {links.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href} className="group relative text-sm tracking-tight text-white/85">
                  <TextScramble text={link.label} className="font-space-grotesk" />
                  <span className={`absolute -bottom-1 left-1/2 h-[1px] w-full -translate-x-1/2 bg-coral transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link href="/dashboard" className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white">Dashboard</Link>
                <button onClick={() => supabase.auth.signOut()} className="rounded-full bg-coral px-4 py-1.5 text-xs font-semibold text-slate-950">Logout</button>
              </>
            ) : (
              <Link href="/login" className="rounded-full bg-coral px-4 py-1.5 text-xs font-semibold text-slate-950">Login</Link>
            )}
          </div>

          <button className="text-white md:hidden" onClick={() => setOpen(true)} aria-label="Open mobile menu">
            <Menu size={18} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-slate/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ml-auto flex h-full w-[82%] max-w-sm flex-col gap-5 bg-[#121a2d] p-6" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
              <button className="self-end text-white" onClick={() => setOpen(false)} aria-label="Close mobile menu">
                <X size={18} />
              </button>
              {links.map((link, index) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.1 }}>
                  <Link href={link.href} className="font-space-grotesk text-lg text-white" onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
