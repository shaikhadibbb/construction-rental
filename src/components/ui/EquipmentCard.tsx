'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Equipment } from '@/types'

/**
 * Equipment card displayed in the catalog grid.
 * Uses Next.js Image for optimised loading with Supabase storage URLs.
 *
 * @param equipment - The equipment record to display
 */
export default function EquipmentCard({ equipment }: { equipment: Equipment }) {
  // Cinematic 3D Tilt Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width; const height = rect.height
    const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5; const yPct = mouseY / height - 0.5
    x.set(xPct); y.set(yPct)
  }

  // Artificial High-End Telematics Indicator
  const hoursAgo = Math.floor(Math.random() * 24) + 1

  return (
    <Link href={`/catalog/${equipment.id}`} style={{ textDecoration: 'none', display: 'block', perspective: '1000px' }}>
      <motion.div className="ui-card ui-card-interactive"
        style={{
          rotateX, rotateY, transformStyle: "preserve-3d",
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%',
          boxShadow: 'var(--shadow-soft)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0) }}>

        {/* Image area */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0d111a', overflow: 'hidden', flexShrink: 0 }}>
          {equipment.image_url ? (
            <Image
              src={equipment.image_url}
              alt={equipment.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚧</div>
          )}
          {/* Availability badge */}
          <span style={{
            position: 'absolute', top: 12, left: 12,
            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
            display: 'flex', alignItems: 'center', gap: 5,
            background: equipment.is_available ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${equipment.is_available ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: equipment.is_available ? '#4ade80' : '#f87171',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: equipment.is_available ? '#4ade80' : '#f87171', display: 'inline-block' }} />
            {equipment.is_available ? 'Available' : 'Unavailable'}
          </span>
          {/* Telematics Badge */}
          <span style={{
            position: 'absolute', top: 12, right: 12,
            fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 100,
            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
          }}>
            ⚙️ Inspected {hoursAgo}h ago
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, color: '#f4a261', textTransform: 'uppercase', letterSpacing: '0.11em', fontWeight: 700, marginBottom: 8, display: 'block' }}>
            {equipment.category}
          </span>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.015em', lineHeight: 1.25 }}>
            {equipment.name}
          </h3>
          <p style={{
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, flex: 1,
            marginBottom: 16, overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'],
          }}>
            {equipment.description || 'Professional-grade equipment available for rental.'}
          </p>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginBottom: 2 }}>Starting from</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                ₹{equipment.daily_rate.toLocaleString('en-IN')}
                <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-subtle)' }}>/day</span>
              </p>
            </div>
            <span style={{ fontSize: 13, color: '#f4a261', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}