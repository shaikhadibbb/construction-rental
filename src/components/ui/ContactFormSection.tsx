'use client'

import { useState } from 'react'

export default function ContactFormSection() {
  const [form, setForm] = useState({ name: '', email: '', equipment: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/request-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, equipment: form.equipment }),
    })
    setSent(true)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e5e2dd',
    borderRadius: 8,
    fontSize: 15,
    background: '#fff',
    color: '#1a1a1a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  if (sent) return (
    <div style={{ padding: '24px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
      <p style={{ fontWeight: 700, color: '#15803d', marginBottom: 4 }}>Message sent.</p>
      <p style={{ color: '#166534', fontSize: 14 }}>We will contact you within 2 hours.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <input
        required
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="Your name"
        style={inputStyle}
      />
      <input
        required
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        placeholder="Email address"
        style={inputStyle}
      />
      <input
        required
        value={form.equipment}
        onChange={e => setForm({ ...form, equipment: e.target.value })}
        placeholder="Equipment needed (e.g. 20T Excavator, 2 weeks, Mumbai)"
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: '#1a1a1a',
          color: '#fff',
          fontWeight: 700,
          padding: '13px 28px',
          borderRadius: 8,
          border: 'none',
          fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
          fontFamily: 'inherit',
          opacity: loading ? 0.6 : 1,
        }}>
        {loading ? 'Sending...' : 'Send Request →'}
      </button>
    </form>
  )
}