'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import type { Booking, Profile } from '@/types'

const STATUS_CONFIG: Record<string, { bg: string, color: string, dot: string }> = {
  pending:   { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', dot: '#eab308' },
  confirmed: { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', dot: '#4ade80' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', dot: '#f87171' },
  completed: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', dot: 'rgba(255,255,255,0.3)' },
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      setFullName(profile?.full_name || '')
      const { data: bookings } = await supabase
        .from('bookings').select('*, equipment(name, image_url, category)')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      setBookings((bookings as Booking[]) || [])
      setLoading(false)
    }
    fetchAll()
  }, [router])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading profile…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  const initials = (fullName || user?.email || '?')[0].toUpperCase()

  const cardStyle: React.CSSProperties = { background: 'var(--surface-0)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: '24px', boxShadow: 'var(--shadow-soft)' }
  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }

  return (
    <div className="ui-page-shell" style={{ color: '#e8e8e8' }}>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(8,8,8,1) 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: '#f4a261', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, flexShrink: 0, boxShadow: '0 10px 30px rgba(244,162,97,0.2)' }}>
              {initials}
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#f4a261', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 6 }}>Account Profile</span>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>{fullName || 'Contractor'}</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {user?.email}
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                Joined {new Date(user?.created_at || '').getFullYear()}
              </p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(120deg, rgba(74,222,128,0.1), rgba(74,222,128,0.02))', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>💸 Available Credits</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>₹{(profile?.credits_balance || 0).toLocaleString('en-IN')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Applies automatically to next rental.</p>
              <p style={{ fontSize: 11, color: 'rgba(74,222,128,0.6)', marginTop: 4 }}>Earn 2% back on all completed bookings.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Quotes', value: bookings.length },
              { label: 'Verified', value: profile?.role === 'admin' ? 'Admin' : 'Customer' },
              { label: 'Active', value: bookings.filter(b => b.status === 'confirmed').length },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 2 }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Profile Settings */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 18 }}>⚙️</span>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>General Settings</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Display Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelStyle}>Email Address (Protected)</label>
              <input type="text" value={user?.email} disabled style={{ ...inputStyle, background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed' }} />
            </div>

            {saved && (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ Profile updated successfully!
              </div>
            )}

            <button onClick={handleSave} disabled={saving}
              style={{ width: 'fit-content', background: '#f4a261', color: '#0a0a0a', fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'all 0.2s', marginTop: 4 }}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Recent Activity</h2>
            <Link href="/dashboard" style={{ fontSize: 12, color: '#f4a261', fontWeight: 700, textDecoration: 'none' }}>Full Dashboard →</Link>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>No bookings found. Ready to start your next project?</p>
              <Link href="/catalog" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, color: '#f4a261', fontWeight: 700, textDecoration: 'none' }}>Browse Equipment 🚧</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {bookings.map(booking => {
                const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
                const equipName = booking.equipment_name || booking.equipment?.name || 'Equipment'
                const equipImg = booking.equipment?.image_url
                return (
                  <div key={booking.id} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', background: '#111', flexShrink: 0, position: 'relative' }}>
                      {equipImg ? (
                        <Image src={equipImg} alt={equipName} fill sizes="48px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🚧</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{equipName}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize' }}>{booking.equipment?.category || 'Machine'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: status.color, background: status.bg, padding: '4px 10px', borderRadius: 100, border: `1px solid ${status.bg}`, letterSpacing: '0.04em' }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Link href="/dashboard"
            style={{ ...cardStyle, flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}>
            <span style={{ fontSize: 28 }}>⚡</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>My Dashboard</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Manage rentals</p>
            </div>
          </Link>
          <Link href="/catalog"
            style={{ ...cardStyle, flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}>
            <span style={{ fontSize: 28 }}>🏗️</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>New Rental</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Rent equipment</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}