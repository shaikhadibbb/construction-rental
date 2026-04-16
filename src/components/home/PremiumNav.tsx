'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

const links = [
  { href: '/catalog', label: 'Equipment' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#cities', label: 'Cities' },
  { href: '#for-contractors', label: 'For Contractors' },
]

export function PremiumNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { user } = useUser()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
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
            <span className="font-space-grotesk text-base font-bold tracking-tight text-white">Construct<span className="text-coral">Rent</span></span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {links.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href} className="group relative text-sm tracking-tight text-white/70 hover:text-white transition-colors">
                  <span className="font-space-grotesk">{link.label}</span>
                  <span className={`absolute -bottom-1 left-1/2 h-[1px] w-full -translate-x-1/2 bg-coral transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="mr-2 text-xs font-medium text-white/70">Call: +91-99999-99999</span>
            <select className="rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/70 outline-none focus:border-white/20" aria-label="Language selector">
              <option className="bg-slate-900 text-white">EN</option>
              <option className="bg-slate-900 text-white">HI</option>
              <option className="bg-slate-900 text-white">GU</option>
              <option className="bg-slate-900 text-white">MR</option>
            </select>
            {user ? (
              <>
                <Link href="/dashboard" className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white hover:bg-white/5 transition-colors">Dashboard</Link>
                <button onClick={() => supabase.auth.signOut()} className="rounded-full bg-coral hover:bg-[#ff8a6c] transition-colors px-4 py-1.5 text-xs font-semibold text-white">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white hover:bg-white/5 transition-colors">Login</Link>
                <Link href="/contact" className="rounded-full bg-coral hover:bg-[#ff8a6c] transition-colors px-4 py-1.5 text-xs font-semibold text-white">Get Quote</Link>
              </>
            )}
          </div>

          <button className="text-white md:hidden" onClick={() => setOpen(true)} aria-label="Open mobile menu">
            <Menu size={18} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-[#050505]/60 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ml-auto flex h-full w-[82%] max-w-sm flex-col gap-5 bg-[#0a0a0a] border-l border-white/10 p-6" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
              <button className="self-end text-white/50 hover:text-white transition-colors" onClick={() => setOpen(false)} aria-label="Close mobile menu">
                <X size={18} />
              </button>
              {links.map((link, index) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.1 }}>
                  <Link href={link.href} className="font-space-grotesk text-lg font-medium text-white/80 hover:text-white transition-colors border-b border-white/5 pb-2 block w-full" onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <a href="tel:+919999999999" className="mt-4 rounded-xl bg-coral px-4 py-3 text-center font-semibold text-white">
                Call us: +91-99999-99999
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
