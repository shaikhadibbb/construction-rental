'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WHATSAPP_NUMBER, CALL_NUMBER } from '@/lib/constants'

/**
 * Quote request form shown on individual equipment pages.
 * Submits to the bookings table (status: pending) and fires the quote email API.
 */
export default function QuoteForm({ equipmentName }: { equipmentName: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', start_date: '', end_date: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const whatsappMessage = encodeURIComponent(`Hi! I want to rent the *${equipmentName}*. Please share pricing and availability.`)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill in your name, email and phone')
      return
    }
    if (loading) return // Prevent double-submission

    setLoading(true)
    try {
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
      if (dbError) throw dbError

      // Fire-and-forget email notification
      fetch('/api/request-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, equipment: equipmentName }),
      }).catch(console.error)

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div style={{ width: 56, height: 56, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg style={{ width: 24, height: 24, color: '#4ade80' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p style={{ fontWeight: 800, color: '#fff', fontSize: 16, marginBottom: 6 }}>Quote Request Sent!</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
          Our team will call you back within <strong style={{ color: 'rgba(255,255,255,0.7)' }}>2 hours</strong>.
        </p>
        <div style={{ background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          Need it faster? Call us:<br />
          <a href={`tel:${CALL_NUMBER}`} style={{ fontWeight: 800, color: '#f4a261', textDecoration: 'none' }}>{CALL_NUMBER}</a>
        </div>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#e8e8e8',
    outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Status indicator */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Available Now</span>
        </div>
        <h3 style={{ fontWeight: 800, color: '#fff', fontSize: 16, marginBottom: 2 }}>Get a Free Quote</h3>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>⚡ We respond within <strong style={{ color: 'rgba(255,255,255,0.6)' }}>2 hours</strong> — Mon to Sat</p>
      </div>

      {/* Primary CTAs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <a href={`tel:${CALL_NUMBER}`} aria-label={`Call us at ${CALL_NUMBER}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, padding: '11px', borderRadius: 10, textDecoration: 'none', fontSize: 13, transition: 'all 0.2s' }}>
          <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
          Call Now
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontWeight: 700, padding: '11px', borderRadius: 10, textDecoration: 'none', fontSize: 13, transition: 'all 0.2s' }}>
          <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          WhatsApp
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <span>or request a callback</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Form fields */}
      <div>
        <label htmlFor="qf-name" style={labelStyle}>Full Name *</label>
        <input id="qf-name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
      </div>
      <div>
        <label htmlFor="qf-phone" style={labelStyle}>Phone *</label>
        <input id="qf-phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
      </div>
      <div>
        <label htmlFor="qf-email" style={labelStyle}>Email *</label>
        <input id="qf-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label htmlFor="qf-start" style={labelStyle}>Start Date</label>
          <input id="qf-start" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
        <div>
          <label htmlFor="qf-end" style={labelStyle}>End Date</label>
          <input id="qf-end" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      </div>
      <div>
        <label htmlFor="qf-message" style={labelStyle}>Project Details</label>
        <textarea id="qf-message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Site location, duration, special requirements…" rows={2}
          style={{ ...inputStyle, resize: 'none' }} />
      </div>

      {error && (
        <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        style={{ width: '100%', background: '#f4a261', color: '#0a0a0a', fontWeight: 800, padding: '13px', borderRadius: 10, border: 'none', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
        {loading ? (
          <>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Sending…
          </>
        ) : '🚀 Get Free Quote Now'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
        {['Free quote', 'No commitment', '2hr response'].map(t => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg style={{ width: 10, height: 10, color: '#4ade80' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            {t}
          </span>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}