'use client'

import { useState } from 'react'
import { MotionReveal } from '@/components/motion/motionPrimitives'

export function VideoDemo() {
  const [activeVideoLabel, setActiveVideoLabel] = useState('Site Delivery Flow')
  const [activeVideo, setActiveVideo] = useState('/demo/construction-demo.mp4')
  const [launchCity, setLaunchCity] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <section id="for-contractors" className="relative z-10 bg-white px-6 py-20">
      <MotionReveal>
        <div className="mx-auto max-w-7xl">
          <h3 className="font-space-grotesk text-3xl text-slate-900">For Contractors</h3>
          <p className="mt-2 text-slate-700">Low-data demo mode for on-site teams. Tap to play when needed.</p>
          <div className="relative mt-6 aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-900">
          <video
            className="h-full w-full object-cover"
            controls
            playsInline
            poster="/hero-poster.jpg"
            preload="none"
          >
            <source src={activeVideo} type="video/mp4" />
          </video>
            <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-900">
              {activeVideoLabel}
            </div>
          </div>
          <h3 className="mt-6 font-space-grotesk text-2xl text-slate-900">See it in action</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Site Delivery Flow', src: '/demo/construction-demo.mp4' },
              { label: 'Operator Handover', src: '/demo/construction-demo.mp4' },
              { label: 'Night Shift Support', src: '/demo/construction-demo.mp4' },
            ].map((video, index) => (
              <button
                key={`${video.src}-${index}`}
                onMouseEnter={() => {
                  setActiveVideo(video.src)
                  setActiveVideoLabel(video.label)
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-800"
              >
                {video.label}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 p-5">
            <h4 className="font-space-grotesk text-xl text-slate-900">Service Area Map</h4>
            <p className="mt-2 text-sm text-slate-700">Depots: Mumbai (Andheri), Delhi (Noida), Bangalore (Whitefield), Pune, Hyderabad · Service radius: 50km.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <input value={launchCity} onChange={e => setLaunchCity(e.target.value)} placeholder="Your city (if not listed)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <button className="rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-white">
                Notify Launch + 20% Off
              </button>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  )
}
