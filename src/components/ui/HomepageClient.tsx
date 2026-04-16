'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PremiumNav } from '@/components/home/PremiumNav'
import { HeroSection } from '@/components/home/HeroSection'
import { EquipmentShowcase } from '@/components/home/EquipmentShowcase'
import { FeaturesBento } from '@/components/home/FeaturesBento'
import { VideoDemo } from '@/components/home/VideoDemo'
import { PricingSection } from '@/components/home/PricingSection'
import { PremiumFooter } from '@/components/home/PremiumFooter'

const demoEquipment = [
  { id: '1', name: 'JCB 3DX Super Excavator', category: 'Excavator', daily_rate: 2500, image_url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=70', is_available: true },
  { id: '2', name: 'Liebherr 50T Crane', category: 'Crane', daily_rate: 11000, image_url: 'https://images.unsplash.com/photo-1577801620048-3c665bf5ecf0?auto=format&fit=crop&w=1200&q=70', is_available: true },
  { id: '3', name: 'Tata Hitachi EX200', category: 'Excavator', daily_rate: 6800, image_url: 'https://images.unsplash.com/photo-1621905252472-e8f00d94bb42?auto=format&fit=crop&w=1200&q=70', is_available: true },
  { id: '4', name: 'Volvo SD110 Compactor', category: 'Compactor', daily_rate: 5000, image_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=70', is_available: true },
] as const

export default function HomepageClient() {
  const [loading, setLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="ui-page-shell relative min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait" onExitComplete={() => setContentReady(true)}>
        {loading ? (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[#0F172A]"
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.svg width="98" height="98" viewBox="0 0 98 98" className="text-[#FF6B4A]">
              <motion.path
                d="M18 18h34a12 12 0 0 1 0 24H31v14h18"
                stroke="currentColor"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
              />
              <motion.path
                d="M52 20h14a14 14 0 0 1 0 28H52v30"
                stroke="#FFD700"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
            </motion.svg>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="font-space-grotesk text-sm text-white/80">
              Construct Rent
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {contentReady && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div initial={reduceMotion ? false : { y: '-100%' }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 12 }}>
              <PremiumNav />
            </motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.3 }}>
              <HeroSection />
            </motion.div>
            <EquipmentShowcase equipment={[...demoEquipment]} />
            <FeaturesBento />
            <VideoDemo />
            <PricingSection />
            <PremiumFooter />
            <div className="fixed bottom-4 left-1/2 z-50 flex w-[92%] -translate-x-1/2 gap-2 md:hidden">
              <a href="tel:+919999999999" className="flex-1 rounded-xl bg-coral px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
                Call Support
              </a>
              <a href="/dashboard" className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white">
                My Bookings
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}