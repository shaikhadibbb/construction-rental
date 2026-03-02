'use client'

import { useState } from 'react'

const ROLES = [
  {
    title: 'Equipment Operator',
    type: 'Full Time',
    location: 'Mumbai',
    desc: 'Operate heavy construction equipment including excavators, cranes, and forklifts at client sites across Mumbai.',
    requirements: ['Valid heavy equipment operator license', 'Minimum 2 years experience', 'Knowledge of safety protocols', 'Available for site work'],
  },
  {
    title: 'Crane Operator',
    type: 'Full Time',
    location: 'Mumbai / Pune',
    desc: 'Operate mobile cranes for construction, infrastructure, and industrial projects. Must have experience with all-terrain cranes.',
    requirements: ['Crane operator certification', 'Minimum 3 years crane experience', 'Experience with LTM/LTC cranes preferred', 'Physically fit for outdoor work'],
  },
  {
    title: 'Forklift Operator',
    type: 'Part Time / Full Time',
    location: 'Mumbai',
    desc: 'Operate forklifts at warehouses, construction sites, and logistics hubs. Both indoor and outdoor assignments available.',
    requirements: ['Forklift operator license', 'Warehouse or site experience', 'Flexible availability', 'Good communication skills'],
  },
  {
    title: 'Equipment Maintenance Technician',
    type: 'Full Time',
    location: 'Mumbai',
    desc: 'Maintain, inspect, and repair construction equipment to ensure safety and reliability before every rental.',
    requirements: ['Mechanical/electrical qualification', 'Experience with heavy machinery', 'Problem-solving skills', 'Own transport preferred'],
  },
]

export default function CareersPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone) { setError('Name, email and phone are required'); return }
    setLoading(true)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        subject: 'Job Application: ' + selected,
        message: `Phone: ${form.phone}\nExperience: ${form.experience}\n\n${form.message}`
      }),
    })
    if (res.ok) { setSent(true) } else { setError('Failed to submit. Please try again.') }
    setLoading(false)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-5xl block mb-4">👷</span>
          <h1 className="text-4xl font-bold mb-3">Join Our Team</h1>
          <p className="text-gray-300 text-lg">We are looking for skilled equipment operators and technicians to grow with ConstructRent across Mumbai and beyond.</p>
        </div>
      </section>

      {/* Why work with us */}
      <section className="py-14 px-4 bg-yellow-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Work With Us</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: '💰', title: 'Competitive Pay', desc: 'Market-leading rates paid on time, every time.' },
              { emoji: '📅', title: 'Flexible Shifts', desc: 'Full time and part time roles available.' },
              { emoji: '🛡️', title: 'Safe Equipment', desc: 'Work with well-maintained, certified machinery.' },
              { emoji: '📈', title: 'Grow With Us', desc: 'Training and advancement opportunities.' },
            ].map(perk => (
              <div key={perk.title} className="bg-white border border-yellow-200 rounded-2xl p-5 text-center shadow-sm">
                <span className="text-3xl block mb-2">{perk.emoji}</span>
                <p className="font-bold text-gray-900 text-sm">{perk.title}</p>
                <p className="text-gray-500 text-xs mt-1">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Open Positions</h2>
          <div className="space-y-4">
            {ROLES.map(role => (
              <div key={role.title} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setSelected(selected === role.title ? null : role.title)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{role.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">{role.type}</span>
                      <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">📍 {role.location}</span>
                    </div>
                  </div>
                  <span className={'text-2xl transition-transform duration-200 text-gray-400 ' + (selected === role.title ? 'rotate-45' : '')}>+</span>
                </button>

                {selected === role.title && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <p className="text-gray-600 text-sm mb-4">{role.desc}</p>
                    <p className="font-semibold text-gray-900 text-sm mb-2">Requirements:</p>
                    <ul className="space-y-1 mb-6">
                      {role.requirements.map(req => (
                        <li key={req} className="text-sm text-gray-500 flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">✓</span> {req}
                        </li>
                      ))}
                    </ul>

                    {sent && selected === role.title ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-2xl mb-1">🎉</p>
                        <p className="font-bold text-green-800">Application Submitted!</p>
                        <p className="text-green-600 text-sm mt-1">We will be in touch within 3-5 business days.</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                        <p className="font-semibold text-gray-900 text-sm">Apply for {role.title}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Years of Experience</label>
                          <input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 3 years"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Tell us about yourself</label>
                          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                            placeholder="Licenses held, equipment experience, availability..." rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none bg-white" />
                        </div>
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>}
                        <button onClick={handleApply} disabled={loading}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition-colors">
                          {loading ? 'Submitting...' : 'Submit Application →'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Don't see the right role?</h2>
          <p className="text-gray-400 mb-6">Send us your CV anyway — we are always looking for great people.</p>
          <a href="mailto:adibazam123@gmail.com" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-colors inline-block">
            Send Your CV →
          </a>
        </div>
      </section>
    </div>
  )
}
