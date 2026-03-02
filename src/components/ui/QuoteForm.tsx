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

  const whatsappMessage = encodeURIComponent(`Hi! I'm interested in renting the *${equipmentName}*. Can you share the pricing and availability?`)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone) { setError('Name, email and phone are required'); return }
    setLoading(true)

    // Save to Supabase bookings table
    const { error: dbError } = await supabase.from('bookings').insert({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      equipment_name: equipmentName,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      notes: form.message,
      status: 'pending',
      total_amount: 0,
    })

    if (dbError) {
      setError('Failed to submit: ' + dbError.message)
      setLoading(false)
      return
    }

    // Send email notification
    await fetch('/api/request-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, equipment: equipmentName }),
    })

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-3">🎉</p>
        <p className="font-bold text-gray-900 text-lg mb-1">Quote Request Sent!</p>
        <p className="text-gray-500 text-sm">We will contact you within 24 hours with pricing details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900 text-lg">Request a Quote</h3>
      <p className="text-gray-500 text-sm">Fill in your details and we will get back to you with pricing.</p>

      {/* Quick contact buttons */}
      <div className="grid grid-cols-2 gap-2 pb-1">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
          📱 WhatsApp
        </a>
        <a href={'tel:' + CALL_NUMBER}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
          📞 Call Us
        </a>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span>or fill the form below</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
          <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
          <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Additional Notes</label>
        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Project details, special requirements..." rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>}
      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition-colors">
        {loading ? 'Sending...' : 'Request Quote →'}
      </button>
      <p className="text-xs text-gray-400 text-center">We reply within 24 hours</p>
    </div>
  )
}