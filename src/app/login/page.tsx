'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard') }
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:bg-white transition-colors"
  const labelClass = "block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2"

  return (
    <div className="min-h-screen bg-[#0a1628] flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px)'}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
          </div>
          <span className="font-black text-white text-lg">Construct<span className="text-yellow-500">Rent</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            India's Most Trusted<br /><span className="text-yellow-500">Equipment Rental</span><br />Platform
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Access 50+ professional-grade machines. Request a quote in minutes.
          </p>
          <div className="space-y-4">
            {[
              '50+ equipment items across 6 categories',
              'Quote response within 2 hours',
              'On-site delivery across India',
              'Verified & insured equipment',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs relative z-10">© 2026 ConstructRent. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-yellow-500 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
            </div>
            <span className="font-black text-[#0a1628]">Construct<span className="text-yellow-500">Rent</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0a1628]">Welcome back</h1>
            <p className="text-gray-400 mt-1">Sign in to manage your rentals</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Your password"
                  className={inputClass + ' pr-12'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-300 text-[#0a1628] font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/20 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-yellow-600 font-bold hover:text-yellow-700">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}