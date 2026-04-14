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

  const input: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, fontSize: 15, color: '#e8e8e8',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', fontFamily: 'var(--font-geist-sans, -apple-system, Inter, sans-serif)' }}>

      {/* Grid texture */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Left panel */}
      <div style={{ display: 'none', width: '50%', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', borderRight: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }} className="cr-left-panel">
        <div style={{ position: 'absolute', top: '20%', right: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(244,162,97,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Link href="/" style={{ fontWeight: 800, fontSize: 17, color: '#fff', textDecoration: 'none', letterSpacing: '-0.03em', position: 'relative', zIndex: 1 }}>
          Construct<span style={{ color: '#f4a261' }}>Rent</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.03em' }}>
            Join hundreds of<br />
            <span style={{ color: '#f4a261' }}>professional</span><br />
            contractors.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, marginBottom: 40 }}>
            Free to join. Request quotes, track rentals, manage your equipment — all in one place.
          </p>

          {/* Testimonial */}
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" fill="#f4a261" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 16 }}>
              "Booked an excavator in under 3 minutes. The process was seamless and the equipment was in perfect condition."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f4a261, #e76f51)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>R</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Rajesh Kumar</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Site Manager, Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', position: 'relative', zIndex: 1 }}>© 2026 ConstructRent</p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <Link href="/" style={{ fontWeight: 800, fontSize: 17, color: '#fff', textDecoration: 'none', letterSpacing: '-0.03em', display: 'block', marginBottom: 40 }} className="cr-mobile-logo">
            Construct<span style={{ color: '#f4a261' }}>Rent</span>
          </Link>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.03em' }}>Create your account</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>Free to join — start renting in minutes</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink: 0 }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Your full name" style={input}
                onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={input}
                onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ ...input, paddingRight: 56 }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'inherit', letterSpacing: '0.05em' }}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#4ade80', flexShrink: 0 }}><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              Your data is secure. We never share your information.
            </p>

            <button type="submit" disabled={loading} style={{
              background: loading ? 'rgba(244,162,97,0.5)' : '#f4a261',
              color: '#0a0a0a', fontWeight: 700, padding: '14px', borderRadius: 10,
              border: 'none', fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginTop: 4, transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 0 30px rgba(244,162,97,0.2)',
            }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 28 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#f4a261', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.18); }
        @media (min-width: 1024px) {
          .cr-left-panel { display: flex !important; }
          .cr-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}