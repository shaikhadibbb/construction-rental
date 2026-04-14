'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { MotionReveal, MagneticButton } from '@/components/motion/motionPrimitives'

export function VideoDemo() {
  const [open, setOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState('/demo/construction-demo.mp4')

  return (
    <section id="video-demo" className="relative z-10 bg-slate-900/50 px-6 py-32">
      <MotionReveal>
        <div className="mx-auto max-w-7xl">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
            preload="metadata"
          >
            <source src="/demo/construction-demo.webm" type="video/webm" />
              <source src={activeVideo} type="video/mp4" />
          </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A66] to-[#0F172AE6]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MagneticButton
                onClick={() => setOpen(true)}
                className="rounded-full border border-white/20 bg-white/10 p-6 text-white backdrop-blur-xl"
                aria-label="Open demo video"
              >
                <Play />
              </MagneticButton>
            </div>
          </div>
          <h3 className="mt-6 font-space-grotesk text-3xl text-white">See it in action</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {['/demo/construction-demo.mp4', '/demo/construction-demo.mp4', '/demo/construction-demo.mp4'].map((video, index) => (
              <button
                key={`${video}-${index}`}
                onMouseEnter={() => setActiveVideo(video)}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/80"
              >
                Montage Preview {index + 1}
              </button>
            ))}
          </div>
        </div>
      </MotionReveal>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="relative w-[92vw] max-w-6xl overflow-hidden rounded-3xl border border-white/20" initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}>
              <video className="w-full" controls autoPlay>
                <source src={activeVideo} type="video/mp4" />
              </video>
              <button className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white" onClick={() => setOpen(false)} aria-label="Close video">
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
