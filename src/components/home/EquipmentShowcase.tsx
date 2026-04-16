'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
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
  const [today] = useState(() => {
    const date = new Date()
    return date.toISOString().slice(0, 10)
  })
  const detailData = useMemo(
    () => ({
      'JCB 3DX Super Excavator': {
        specs: '3 Ton | Diesel | Bucket Capacity 0.3m³',
        availability: 'Available Tomorrow',
        sheet: 'Height: 2.7m · Weight: 7,600kg · Transport: 10-wheeler trailer',
      },
      'Tata Hitachi EX200': {
        specs: '20 Ton | Diesel | Bucket Capacity 1.0m³',
        availability: '3 units left',
        sheet: 'Height: 3.1m · Weight: 20,000kg · Transport: Low-bed trailer',
      },
      'Liebherr 50T Crane': {
        specs: '50 Ton | Diesel | Boom 35m',
        availability: 'Available Tomorrow',
        sheet: 'Height: 3.6m · Weight: 32,000kg · Transport: Escort required',
      },
      fallback: {
        specs: '3 Ton | Diesel | Bucket Capacity 0.3m³',
        availability: 'Available Tomorrow',
        sheet: 'Height: 2.7m · Weight: 7,600kg · Transport: 10-wheeler trailer',
      },
    }),
    []
  )

  const activeEquipment = equipment.find(item => item.id === activeId) || null
  const activeMeta = activeEquipment ? detailData[activeEquipment.name as keyof typeof detailData] || detailData.fallback : null
  const primaryOperator = operators.find(operator => operator.isAvailable)

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

  return (
    <section id="equipment" className="relative z-10 bg-white py-20 text-slate-900">
      <MotionReveal>
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-6">
          <div>
            <h2 className="font-space-grotesk text-4xl tracking-[-0.02em]">Equipment Grid</h2>
            <p className="mt-2 text-slate-600">Find the right machine fast with upfront specs and pricing.</p>
          </div>
        </div>
      </MotionReveal>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-6 lg:grid-cols-4">
        {equipment.map((item, index) => (
          <MotionReveal key={item.id} delay={0.08 * index}>
            <FloatingCard className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button onClick={() => setActiveId(item.id)} className="block w-full text-left">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  {item.image_url ? <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" /> : <div className="flex h-full items-center justify-center text-5xl">🚧</div>}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  <p className="mt-1 text-xs text-slate-600">{detailData[item.name as keyof typeof detailData]?.specs || detailData.fallback.specs}</p>
                  <p className="mt-2 text-sm font-semibold text-coral">₹{item.daily_rate.toLocaleString('en-IN')}/day</p>
                  <p className="mt-1 inline-flex rounded-full bg-[#FFD700]/20 px-2 py-1 text-[11px] font-medium text-slate-800">
                    {detailData[item.name as keyof typeof detailData]?.availability || detailData.fallback.availability}
                  </p>
                  <span className="mt-3 block w-full rounded-lg bg-coral px-3 py-2 text-center text-sm font-semibold text-white">
                    Book Now
                  </span>
                </div>
              </button>
            </FloatingCard>
          </MotionReveal>
        ))}
      </div>

      {activeEquipment && activeMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-space-grotesk text-2xl">{activeEquipment.name}</h3>
              <button onClick={() => setActiveId(null)} className="text-sm text-slate-500">Close</button>
            </div>
            <p className="text-sm text-slate-700">{activeMeta.sheet}</p>
            <p className="mt-1 text-xs text-slate-500">Last serviced: {new Date().toLocaleDateString()} · Insurance valid until 31 Mar 2027 · RC Book verified</p>
            <div className="mt-4">
              <label htmlFor="availability-date" className="mb-1 block text-sm font-medium">Availability calendar</label>
              <input id="availability-date" type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              <input value={quote.name} onChange={e => setQuote({ ...quote, name: e.target.value })} placeholder="Name" className="rounded-lg border border-slate-300 px-3 py-2" />
              <input value={quote.location} onChange={e => setQuote({ ...quote, location: e.target.value })} placeholder="Site location" className="rounded-lg border border-slate-300 px-3 py-2" />
              <input value={quote.duration} onChange={e => setQuote({ ...quote, duration: e.target.value })} placeholder="Duration (days)" className="rounded-lg border border-slate-300 px-3 py-2" />
              <select value={quote.city} onChange={e => setQuote({ ...quote, city: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2">
                {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map(city => <option key={city}>{city}</option>)}
              </select>
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={needOperator} onChange={e => setNeedOperator(e.target.checked)} /> Add Operator Assignment</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={prioritySupport} onChange={e => setPrioritySupport(e.target.checked)} /> Priority Support ₹500/mo</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={fuelTopUp} onChange={e => setFuelTopUp(e.target.checked)} /> Fuel Top-up Service</label>
              <label className="flex items-center gap-2">
                Damage Protection
                <select value={damageTier} onChange={e => setDamageTier(e.target.value as 'basic' | 'standard' | 'premium')} className="rounded border border-slate-300 px-2 py-1">
                  <option value="basic">Basic (Free)</option>
                  <option value="standard">Standard (8%)</option>
                  <option value="premium">Premium (15%)</option>
                </select>
              </label>
            </div>
            {primaryOperator && needOperator && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold">Assigned Operator</p>
                <p className="text-sm">{primaryOperator.name} · License {primaryOperator.licenseNumber}</p>
                <p className="text-xs text-slate-600">{primaryOperator.yearsExperience}+ years · {primaryOperator.languages.join(', ')} · Police verified</p>
              </div>
            )}
            {pricing && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold">Price Breakdown</p>
                <div className="mt-2 grid gap-1 text-sm text-slate-700">
                  <div className="flex justify-between"><span>Rental</span><span>₹{pricing.rentalSubtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Delivery + Logistics</span><span>₹{(pricing.mandatoryDeliveryFee + pricing.logisticsAndProcessingFee).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Operator (if selected)</span><span>₹{pricing.operatorAssignmentFee.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Damage Plan</span><span>₹{pricing.damageProtectionFee.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-semibold"><span>Total + GST</span><span>₹{pricing.total.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-coral"><span>Pay 20% now</span><span>₹{pricing.advancePayable.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg bg-coral px-4 py-2 font-semibold text-white">Request Quote</button>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent(`Need quote for ${activeEquipment.name} in ${quote.city} for ${quote.duration} days`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800"
              >
                Get Quote on WhatsApp
              </a>
            </div>
            {!isWithinServiceRadius(quote.city as 'Mumbai' | 'Delhi' | 'Bangalore' | 'Pune' | 'Hyderabad', 42) && (
              <p className="mt-3 text-xs text-slate-600">Outside service radius. Contact us for long-distance transport quote.</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
