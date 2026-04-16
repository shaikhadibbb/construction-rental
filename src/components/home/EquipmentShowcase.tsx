'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Equipment } from '@/types'
import { FloatingCard, MotionReveal } from '@/components/motion/motionPrimitives'
import { calculateManagedMarketplacePrice } from '@/lib/managed-marketplace/pricingEngine'
import { operators } from '@/lib/managed-marketplace/mockData'
import { isWithinServiceRadius } from '@/lib/managed-marketplace/depotNetwork'

export function EquipmentShowcase({ equipment }: { equipment: Equipment[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [quote, setQuote] = useState({ name: '', location: '', duration: '3', city: 'Mumbai' })
  const [needOperator, setNeedOperator] = useState(true)
  const [damageTier, setDamageTier] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [prioritySupport, setPrioritySupport] = useState(false)
  const [fuelTopUp, setFuelTopUp] = useState(false)
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  const detailData = useMemo(() => ({
    'JCB 3DX Super Excavator': { specs: '3 Ton | Diesel | Bucket 0.3m³', availability: 'Available Tomorrow', sheet: 'Height: 2.7m · Weight: 7,600kg · Transport: 10-wheeler trailer' },
    'Tata Hitachi EX200':      { specs: '20 Ton | Diesel | Bucket 1.0m³', availability: '3 units left', sheet: 'Height: 3.1m · Weight: 20,000kg · Transport: Low-bed trailer' },
    'Liebherr 50T Crane':      { specs: '50 Ton | Diesel | Boom 35m', availability: 'Available Tomorrow', sheet: 'Height: 3.6m · Weight: 32,000kg · Transport: Escort required' },
    fallback:                  { specs: '3 Ton | Diesel | Bucket 0.3m³', availability: 'Available Tomorrow', sheet: 'Height: 2.7m · Weight: 7,600kg · Transport: 10-wheeler trailer' },
  }), [])

  const activeEquipment = equipment.find(item => item.id === activeId) || null
  const activeMeta = activeEquipment ? detailData[activeEquipment.name as keyof typeof detailData] || detailData.fallback : null
  const primaryOperator = operators.find(op => op.isAvailable)

  const pricing = activeEquipment
    ? calculateManagedMarketplacePrice({
        city: quote.city as 'Mumbai' | 'Delhi' | 'Bangalore' | 'Pune' | 'Hyderabad',
        category: (activeEquipment.category as 'Excavator' | 'Crane' | 'Forklift' | 'Loader' | 'Compactor' | 'Boom Lift' | 'Generator') || 'Excavator',
        baseRate: activeEquipment.daily_rate,
        startDate: today,
        endDate: new Date(new Date(today).getTime() + Number(quote.duration || 3) * 86400000).toISOString().slice(0, 10),
        distanceKm: 42,
        transportClass: /crane/i.test(activeEquipment.name) ? 'oversize' : 'heavy',
        includeOperator: needOperator,
        includeDamageProtection: damageTier !== 'basic',
        includePrioritySupport: prioritySupport,
        includeFuelTopUp: fuelTopUp,
        nightDelivery: false,
        noticeHours: 18,
        bookingMode: 'b2c',
      })
    : null

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="equipment" className="relative z-10 py-20" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <MotionReveal>
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-6">
          <div>
            <p style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Fleet Inventory</p>
            <h2 className="font-space-grotesk" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05 }}>Equipment Grid</h2>
            <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 15 }}>Find the right machine fast with upfront specs and pricing.</p>
          </div>
          <a href="/catalog" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(255,107,44,0.3)', padding: '8px 16px', borderRadius: 100 }}>
            View All →
          </a>
        </div>
      </MotionReveal>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-6 lg:grid-cols-4">
        {equipment.map((item, index) => (
          <MotionReveal key={item.id} delay={0.08 * index}>
            <FloatingCard className="overflow-hidden rounded-2xl cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', transition: 'border-color 0.2s' }}>
              <button onClick={() => setActiveId(item.id)} className="block w-full text-left">
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', background: 'rgba(0,0,0,0.3)' }}>
                  {item.image_url
                    ? <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" style={{ transition: 'transform 0.6s ease' }} />
                    : <div className="flex h-full items-center justify-center text-5xl">🚧</div>}
                  {/* Availability pill */}
                  <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: item.is_available ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${item.is_available ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, color: item.is_available ? '#4ade80' : '#f87171', backdropFilter: 'blur(8px)' }}>
                    {item.is_available ? '● Available' : '● Unavailable'}
                  </span>
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                  {/* Price on card image bottom */}
                  <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>₹{item.daily_rate.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>/day</span>
                  </div>
                </div>
                <div style={{ padding: '14px 16px 18px' }}>
                  <p style={{ fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>{item.category}</p>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{detailData[item.name as keyof typeof detailData]?.specs || detailData.fallback.specs}</p>
                  <div style={{ marginTop: 12, background: 'linear-gradient(120deg, var(--accent), var(--accent-hover))', borderRadius: 8, padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#0a0a0a', boxShadow: 'var(--shadow-neon)' }}>
                    Book Now →
                  </div>
                </div>
              </button>
            </FloatingCard>
          </MotionReveal>
        ))}
      </div>

      {/* Premium Dark Glassmorphic Modal */}
      <AnimatePresence>
        {activeEquipment && activeMeta && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setActiveId(null)}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden"
              style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, backdropFilter: 'blur(24px)', maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              {/* Modal Header */}
              <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>{activeEquipment.category} · Premium Checkout</p>
                    <h3 className="font-space-grotesk" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{activeEquipment.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{activeMeta.sheet}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>
                      Last serviced: {new Date().toLocaleDateString()} · Insurance valid until 31 Mar 2027 · RC Book verified
                    </p>
                  </div>
                  <button onClick={() => setActiveId(null)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                    Close
                  </button>
                </div>
              </div>

              <div style={{ padding: '24px 28px 28px' }}>
                {/* Date Picker */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Rental Start Date</label>
                  <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} />
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
                  <input value={quote.name} onChange={e => setQuote({ ...quote, name: e.target.value })} placeholder="Your Name" style={inputStyle} />
                  <input value={quote.location} onChange={e => setQuote({ ...quote, location: e.target.value })} placeholder="Site Location" style={inputStyle} />
                  <input value={quote.duration} onChange={e => setQuote({ ...quote, duration: e.target.value })} placeholder="Duration (days)" style={inputStyle} type="number" min="1" />
                  <select value={quote.city} onChange={e => setQuote({ ...quote, city: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map(city => <option key={city} style={{ background: '#0a0a0a' }}>{city}</option>)}
                  </select>
                </div>

                {/* Add-ons */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Add-ons & Services</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={needOperator} onChange={e => setNeedOperator(e.target.checked)} style={{ accentColor: '#ff6b2c' }} />
                      Operator Assignment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={prioritySupport} onChange={e => setPrioritySupport(e.target.checked)} style={{ accentColor: '#ff6b2c' }} />
                      Priority Support ₹500
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={fuelTopUp} onChange={e => setFuelTopUp(e.target.checked)} style={{ accentColor: '#ff6b2c' }} />
                      Fuel Top-up Service
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>Protection:</span>
                      <select value={damageTier} onChange={e => setDamageTier(e.target.value as 'basic' | 'standard' | 'premium')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 8px', color: '#fff', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>
                        <option value="basic" style={{ background: '#0a0a0a' }}>Basic (Free)</option>
                        <option value="standard" style={{ background: '#0a0a0a' }}>Standard (8%)</option>
                        <option value="premium" style={{ background: '#0a0a0a' }}>Premium (15%)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Operator Profile */}
                {primaryOperator && needOperator && (
                  <div style={{ background: 'rgba(255,107,44,0.06)', border: '1px solid rgba(255,107,44,0.2)', borderRadius: 14, padding: '14px 20px', marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Assigned Operator</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{primaryOperator.name} · License {primaryOperator.licenseNumber}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{primaryOperator.yearsExperience}+ years · {primaryOperator.languages.join(', ')} · ✓ Police verified</p>
                  </div>
                )}

                {/* Price Breakdown */}
                {pricing && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Price Breakdown</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Rental', val: pricing.rentalSubtotal },
                        { label: 'Delivery + Logistics', val: pricing.mandatoryDeliveryFee + pricing.logisticsAndProcessingFee },
                        { label: 'Operator', val: pricing.operatorAssignmentFee },
                        { label: 'Damage Protection', val: pricing.damageProtectionFee },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                          <span>{row.label}</span><span>₹{row.val.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#fff' }}>
                        <span>Total + GST</span><span>₹{pricing.total.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
                        <span>Pay 20% now to confirm</span><span>₹{pricing.advancePayable.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ flex: 1, background: 'linear-gradient(120deg, var(--accent), var(--accent-hover))', color: '#0a0a0a', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, padding: '14px 20px', cursor: 'pointer', boxShadow: 'var(--shadow-neon)', fontFamily: 'inherit' }}>
                    🗓️ Get Quote on WhatsApp
                  </button>
                  <a
                    href={`https://wa.me/919999999999?text=${encodeURIComponent(`Need quote for ${activeEquipment.name} in ${quote.city} for ${quote.duration} days`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    Request Callback
                  </a>
                </div>

                {!isWithinServiceRadius(quote.city as 'Mumbai' | 'Delhi' | 'Bangalore' | 'Pune' | 'Hyderabad', 42) && (
                  <p style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Outside service radius. Contact us for long-distance transport quote.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
