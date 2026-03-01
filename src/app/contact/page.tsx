'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      setSent(true)
    } else {
      setError('Failed to send message. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Have a question about renting equipment? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Info cards */}
        <div className="space-y-4">
          {[
            { emoji: '📍', title: 'Location', lines: ['Mumbai, Maharashtra', 'India'] },
            { emoji: '📞', title: 'Phone', lines: ['+91 98765 43210', 'Mon-Sat 9am to 6pm'] },
            { emoji: '✉️', title: 'Email', lines: ['adibazam123@gmail.com', 'We reply within 24 hours'] },
            { emoji: '⏰', title: 'Business Hours', lines: ['Monday to Saturday', '9:00 AM — 6:00 PM IST'] },
          ].map(card => (
            <div key={card.title} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4 shadow-sm">
              <span className="text-2xl">{card.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{card.title}</p>
                {card.lines.map(line => (
                  <p key={line} className="text-gray-500 text-sm">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h2>
              <p className="text-green-600 mb-6">We will get back to you within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="font-bold text-gray-900 text-xl mb-6">Send us a message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Adib Azam"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select a subject</option>
                  <option value="Equipment Inquiry">Equipment Inquiry</option>
                  <option value="Booking Question">Booking Question</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
