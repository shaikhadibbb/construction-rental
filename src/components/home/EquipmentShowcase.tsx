'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Equipment } from '@/types'
import { FloatingCard, MotionReveal } from '@/components/motion/motionPrimitives'

export function EquipmentShowcase({ equipment }: { equipment: Equipment[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <section id="equipment" className="relative z-10 py-32">
      <MotionReveal>
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-6">
          <div>
            <h2 className="font-space-grotesk text-5xl tracking-[-0.02em] text-white">The Fleet</h2>
            <p className="mt-2 text-white/70">Premium machinery, verified and maintained</p>
          </div>
          <Link href="/catalog" className="text-sm text-[#FFD700]">
            View all
          </Link>
        </div>
      </MotionReveal>

      <motion.div
        className="overflow-hidden"
        drag={reduceMotion ? false : 'x'}
        dragConstraints={{ left: -900, right: 0 }}
        dragTransition={{ power: 0.2, timeConstant: 320 }}
      >
        <div className="flex min-w-max gap-6 px-6">
        {equipment.map((item, index) => (
          <MotionReveal key={item.id} delay={0.08 * index}>
            <FloatingCard className="group w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl md:w-[320px]">
              <Link href={`/catalog/${item.id}`} className="block will-change-transform">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
                    {item.category}
                  </span>
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">🚧</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-5 p-5 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="mb-3 text-xs text-white/80">Hydraulic efficiency · On-site support · Instant booking</p>
                    <button className="w-full translate-y-6 rounded-lg bg-gradient-to-r from-coral to-[#ff896f] px-3 py-2 text-sm font-semibold text-white transition group-hover:translate-y-0">
                      Rent Now
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">From ₹{item.daily_rate.toLocaleString('en-IN')}/day</p>
                </div>
              </Link>
            </FloatingCard>
          </MotionReveal>
        ))}
        </div>
      </motion.div>
    </section>
  )
}
