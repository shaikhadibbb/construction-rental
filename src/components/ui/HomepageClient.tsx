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
  { id: '1', name: 'CAT 320 Excavator', category: 'Excavator', daily_rate: 8000, image_url: '', is_available: true },
  { id: '2', name: 'Liebherr 50T Crane', category: 'Crane', daily_rate: 15000, image_url: '', is_available: true },
  { id: '3', name: 'JCB Telehandler', category: 'Telehandler', daily_rate: 9000, image_url: '', is_available: true },
  { id: '4', name: 'Volvo Road Roller', category: 'Compactor', daily_rate: 5000, image_url: '', is_available: true },
] as const

export default function HomepageClient() {
  const [loading, setLoading] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0F172A] text-white">
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

      <div className="pointer-events-none fixed inset-0 opacity-80 will-change-transform">
        <motion.div
          className="absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-[#FF6B4A]/35 blur-[120px]"
          animate={reduceMotion ? undefined : { y: [-20, 20, -20], x: [-12, 12, -12] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#FFD700]/20 blur-[140px]"
          animate={reduceMotion ? undefined : { y: [24, -12, 24], x: [0, -18, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.02] noise-overlay" />

      <AnimatePresence mode="wait">
        {contentReady && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div initial={reduceMotion ? false : { y: '-100%' }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 12 }}>
              <PremiumNav />
            </motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 100, damping: 12 }}>
              <HeroSection />
            </motion.div>
            <EquipmentShowcase equipment={[...demoEquipment]} />
            <FeaturesBento />
            <VideoDemo />
            <PricingSection />
            <PremiumFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}