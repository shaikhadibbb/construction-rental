'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const WHATSAPP_NUMBER = '919876543210'
const CALL_NUMBER = '+919876543210'

export default function QuoteForm({ equipmentName }: { equipmentName: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', start_date: '', end_date: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const whatsappMessage = encodeURIComponent(`Hi! I want to rent the *${equipmentName}*. Please share pricing and availability.`)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone) { setError('Please fill in your name, email and phone'); return }
    setLoading(true)
    const { error: dbError } = await supabase.from('bookings').insert({
      customer_name: form.name, customer_email: form.email, customer_phone: form.phone,
      equipment_name: equipmentName, start_date: form.start_date || null, end_date: form.end_date || null,
      notes: form.message, status: 'pending', total_amount: 0,
    })
    if (dbError) { setError('Failed to submit: ' + dbError.message); setLoading(false); return }
    await fetch('/api/request-quote', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, equipment: equipmentName }),
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-black text-gray-900 text-lg mb-1">Quote Request Sent!</p>
        <p className="text-gray-500 text-sm mb-4">Our team will call you back within <strong>2 hours</strong>.</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800">
          Need it faster? Call us now:<br />
          <a href={'tel:' + CALL_NUMBER} className="font-black text-[#0a1628]">{CALL_NUMBER}</a>
        </div>
      </div>
    )
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Available Now</span>
        </div>
        <h3 className="font-black text-gray-900 text-lg">Get a Free Quote</h3>
        <p className="text-gray-500 text-xs mt-0.5">⚡ We respond within <strong>2 hours</strong> — Mon to Sat</p>
      </div>

      {/* Primary CTAs */}
      <div className="grid grid-cols-2 gap-2">
        <a href={'tel:' + CALL_NUMBER}
          className="flex items-center justify-center gap-2 bg-[#0a1628] hover:bg-[#0d1e35] text-white font-black py-3 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Call Now
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        <span>or request a callback</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Full Name *</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Phone *</label>
        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Email *</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Start Date</label>
          <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">End Date</label>
          <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Project Details</label>
        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Site location, duration, special requirements..." rows={2}
          className={inputClass + ' resize-none'} />
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm">{error}</div>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a1628] font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/25 text-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
            Sending...
          </span>
        ) : '🚀 Get Free Quote Now'}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        {['Free quote', 'No commitment', '2hr response'].map(t => (
          <span key={t} className="flex items-center gap-1">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}