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
            India's most trusted<br />
            <span style={{ color: '#f4a261' }}>equipment rental</span><br />
            platform.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, marginBottom: 48 }}>
            Access 50+ machines. Request a quote in minutes. Get equipment on site in hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              '50+ equipment items across 6 categories',
              'Quote response within 2 hours',
              'On-site delivery across India',
              'Verified and insured equipment',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(244,162,97,0.15)', border: '1px solid rgba(244,162,97,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" fill="none" stroke="#f4a261" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', position: 'relative', zIndex: 1 }}>© 2026 ConstructRent</p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <Link href="/" style={{ fontWeight: 800, fontSize: 17, color: '#fff', textDecoration: 'none', letterSpacing: '-0.03em', display: 'block', marginBottom: 40 }} className="cr-mobile-logo">
            Construct<span style={{ color: '#f4a261' }}>Rent</span>
          </Link>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.03em' }}>Welcome back</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>Sign in to manage your rentals</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink: 0 }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Your password"
                  style={{ ...input, paddingRight: 56 }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'inherit', letterSpacing: '0.05em' }}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

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
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 28 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#f4a261', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
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