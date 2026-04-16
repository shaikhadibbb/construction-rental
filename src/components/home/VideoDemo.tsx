'use client'

import { useState } from 'react'
import { MotionReveal } from '@/components/motion/motionPrimitives'

export function VideoDemo() {
  const [activeVideoLabel, setActiveVideoLabel] = useState('Site Delivery Flow')
  const [activeVideo, setActiveVideo] = useState('/demo/construction-demo.mp4')
  const [launchCity, setLaunchCity] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <section id="for-contractors" className="relative z-10 px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <MotionReveal>
        <div className="mx-auto max-w-7xl">
          <p style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>For Contractors</p>
          <h3 className="font-space-grotesk" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05, marginBottom: 8 }}>See It In Action</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>Low-data demo mode for on-site teams. Tap to play when needed.</p>
          <div className="relative mt-6 aspect-video overflow-hidden rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)' }}>
            <video className="h-full w-full object-cover" controls playsInline poster="/hero-poster.jpg" preload="none">
              <source src={activeVideo} type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              {activeVideoLabel}
            </div>
          </div>
          <h3 className="mt-6 font-space-grotesk" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>Choose a Scenario</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Site Delivery Flow', src: '/demo/construction-demo.mp4' },
              { label: 'Operator Handover', src: '/demo/construction-demo.mp4' },
              { label: 'Night Shift Support', src: '/demo/construction-demo.mp4' },
            ].map((video, index) => (
              <button
                key={`${video.src}-${index}`}
                onMouseEnter={() => { setActiveVideo(video.src); setActiveVideoLabel(video.label) }}
                style={{ background: activeVideoLabel === video.label ? 'rgba(255,107,44,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeVideoLabel === video.label ? 'rgba(255,107,44,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '14px 16px', textAlign: 'left', fontSize: 13, color: activeVideoLabel === video.label ? 'var(--accent)' : 'rgba(255,255,255,0.65)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', fontWeight: activeVideoLabel === video.label ? 700 : 500 }}
              >
                {video.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px' }}>
            <h4 className="font-space-grotesk" style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Service Area</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>Depots: Mumbai · Delhi · Bangalore · Pune · Hyderabad · Service radius: 50km.</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <input value={launchCity} onChange={e => setLaunchCity(e.target.value)} placeholder="Your city (if not listed)" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#fff', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#fff', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
              <button style={{ background: 'linear-gradient(120deg, var(--accent), var(--accent-hover))', color: '#0a0a0a', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'var(--shadow-neon)' }}>
                Notify Launch + 20% Off
              </button>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  )
}
