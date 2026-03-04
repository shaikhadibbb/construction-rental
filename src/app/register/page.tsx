'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard') }
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:bg-white transition-colors"
  const labelClass = "block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2"

  return (
    <div className="min-h-screen bg-[#0a1628] flex">

      {/* Left panel */}
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
            Join Hundreds of<br /><span className="text-yellow-500">Professional</span><br />Contractors
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Create a free account to request quotes, track rentals, and manage your equipment needs in one place.
          </p>

          {/* Testimonial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 text-sm italic leading-relaxed">"Booked an excavator in under 3 minutes. The process was seamless and the equipment was in perfect condition."</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-[#0a1628] font-black text-sm">R</div>
              <div>
                <p className="text-white font-bold text-xs">Rajesh Kumar</p>
                <p className="text-gray-500 text-xs">Site Manager, Mumbai</p>
              </div>
            </div>
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
            <h1 className="text-3xl font-black text-[#0a1628]">Create your account</h1>
            <p className="text-gray-400 mt-1">Free to join — start renting in minutes</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Adib Azam" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters" className={inputClass + ' pr-12'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Trust line */}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              Your data is secure. We never share your information.
            </p>

            <button type="submit" disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-300 text-[#0a1628] font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/20 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-600 font-bold hover:text-yellow-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}