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
    if (res.ok) { setSent(true) } else { setError('Failed to send message. Please try again.') }
    setLoading(false)
  }

  const INFO = [
    { icon: '📍', title: 'Location', lines: ['Mumbai, Maharashtra', 'India'] },
    { icon: '📞', title: 'Phone', lines: ['+91 98765 43210', 'Mon–Sat, 9am–6pm IST'] },
    { icon: '✉️', title: 'Email', lines: ['adibazam123@gmail.com', 'We reply within 24 hours'] },
    { icon: '⏰', title: 'Business Hours', lines: ['Monday to Saturday', '9:00 AM — 6:00 PM IST'] },
  ]

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="bg-[#0a1628] relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px)'}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm font-semibold tracking-wide">GET IN TOUCH</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have a question about renting equipment? Our team is here to help you find the right solution.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Info sidebar */}
          <div className="space-y-4">
            {INFO.map(card => (
              <div key={card.title} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4 shadow-sm hover:border-yellow-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <p className="font-black text-[#0a1628] text-sm">{card.title}</p>
                  {card.lines.map(line => (
                    <p key={line} className="text-gray-500 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-4 rounded-2xl transition-colors">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-black text-sm">Chat on WhatsApp</p>
                <p className="text-green-100 text-xs">Get instant answers</p>
              </div>
            </a>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-[#0a1628] rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Message Sent!</h2>
                <p className="text-gray-400 mb-8">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-6 py-3 rounded-xl transition-colors">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h2 className="font-black text-[#0a1628] text-2xl mb-2">Send us a message</h2>
                <p className="text-gray-400 text-sm mb-8">Fill in the form and we'll get back to you within 24 hours.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Adib Azam"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Subject</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-50 hover:bg-white transition-colors">
                    <option value="">Select a subject</option>
                    <option value="Equipment Inquiry">Equipment Inquiry</option>
                    <option value="Booking Question">Booking Question</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-50 hover:bg-white transition-colors resize-none" />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
                )}

                <button onClick={handleSubmit} disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a1628] font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/20">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send Message →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}