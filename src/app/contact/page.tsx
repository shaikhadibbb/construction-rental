'use client'

import { useState } from 'react'
import { CALL_NUMBER, WHATSAPP_NUMBER, ADMIN_EMAIL } from '@/lib/constants'
import { pushToast } from '@/lib/toast'

const INFO = [
  { icon: '📍', title: 'Location', lines: ['Mumbai, Maharashtra', 'India'] },
  { icon: '📞', title: 'Phone', lines: [CALL_NUMBER, 'Mon–Sat, 9am–6pm IST'] },
  { icon: '✉️', title: 'Email', lines: [ADMIN_EMAIL, 'We reply within 2 hours'] },
  { icon: '⏰', title: 'Hours', lines: ['Monday to Saturday', '9:00 AM — 6:00 PM IST'] },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields'); return }
    setLoading(true)
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      setSent(true)
      pushToast({ title: 'Message sent', description: 'We will respond within 2 hours.', variant: 'success' })
    } else {
      setError('Failed to send. Please try again.')
      pushToast({ title: 'Failed to send message', variant: 'error' })
    }
    setLoading(false)
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 15,
    color: '#e8e8e8', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
  }

  return (
    <div className="ui-page-shell" style={{ color: '#e8e8e8', fontFamily: 'var(--font-geist-sans, -apple-system, Inter, sans-serif)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '72px 24px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Contact</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12, lineHeight: 1.05 }}>Get in touch.</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, maxWidth: 480 }}>Have a question about renting equipment? Our team responds within 2 hours.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'flex-start' }} className="cr-contact-grid">

          {/* Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {INFO.map(card => (
              <div key={card.title} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'border-color 0.2s' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{card.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.title}</p>
                  {card.lines.map(line => <p key={line} style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{line}</p>)}
                </div>
              </div>
            ))}

            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 14, padding: '18px 20px', textDecoration: 'none', transition: 'all 0.2s' }}>
              <span style={{ fontSize: 22 }}>📱</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>Chat on WhatsApp</p>
                <p style={{ fontSize: 12, color: 'rgba(74,222,128,0.6)' }}>Get instant answers</p>
              </div>
            </a>
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ border: '1px solid rgba(74,222,128,0.2)', borderRadius: 20, padding: '64px 32px', textAlign: 'center', background: 'rgba(74,222,128,0.04)' }}>
              <div style={{ width: 56, height: 56, background: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" fill="none" stroke="#080808" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>Message sent.</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>We&apos;ll get back to you within 2 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '12px 24px', borderRadius: 10, border: 'none', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                Send another message
              </button>
            </div>
          ) : (
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '40px', background: 'rgba(255,255,255,0.02)' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Send us a message</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>We respond within 2 hours, Mon–Sat.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="cr-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={input}
                    onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={input}
                    onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Subject</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...input, cursor: 'pointer' }}>
                  <option value="" style={{ background: '#111' }}>Select a subject</option>
                  {['Equipment Inquiry', 'Booking Question', 'Pricing', 'Technical Support', 'Other'].map(s => (
                    <option key={s} value={s} style={{ background: '#111' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..." rows={5}
                  style={{ ...input, resize: 'none', lineHeight: 1.65 }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f87171', marginBottom: 16 }}>{error}</div>}

              <button onClick={handleSubmit} disabled={loading} style={{
                width: '100%', background: loading ? 'rgba(244,162,97,0.5)' : '#f4a261',
                color: '#0a0a0a', fontWeight: 700, padding: '14px', borderRadius: 10,
                border: 'none', fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Sending...
                  </span>
                ) : 'Send Message →'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder, select { color: rgba(255,255,255,0.18); }
        @media (max-width: 768px) {
          .cr-contact-grid { grid-template-columns: 1fr !important; }
          .cr-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}