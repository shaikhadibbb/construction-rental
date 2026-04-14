'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Booking, BookingStatus } from '@/types'
import type { User } from '@supabase/supabase-js'

const STATUS: Record<BookingStatus, { label: string; color: string; dot: string; pulse?: boolean }> = {
  pending:   { label: 'Pending Review', color: 'rgba(234,179,8,0.15)',   dot: '#eab308', pulse: true  },
  confirmed: { label: 'Confirmed',      color: 'rgba(74,222,128,0.12)',  dot: '#4ade80' },
  cancelled: { label: 'Cancelled',      color: 'rgba(239,68,68,0.12)',   dot: '#f87171' },
  completed: { label: 'Completed',      color: 'rgba(255,255,255,0.06)', dot: 'rgba(255,255,255,0.3)' },
}

const STATUS_TEXT: Record<BookingStatus, string> = {
  pending: '#eab308', confirmed: '#4ade80', cancelled: '#f87171', completed: 'rgba(255,255,255,0.4)',
}

export default function DashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [justBooked, setJustBooked] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [filter, setFilter] = useState('all')

  const fetchBookings = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('bookings')
      .select('*, equipment(name, category, image_url, daily_rate)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('booked') === 'true') setJustBooked(true)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)
      fetchBookings(user.id)
    })
  }, [router, fetchBookings])

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  const calcDays = (start: string, end: string) => {
    if (!start || !end) return 0
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    spent: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_amount || 0), 0),
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Loading your dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e8e8e8', fontFamily: 'var(--font-geist-sans, -apple-system, Inter, sans-serif)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '56px 24px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>My Account</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 6, lineHeight: 1.05 }}>Dashboard</h1>
              {user && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>{user.email}</p>}
            </div>
            <Link href="/catalog" style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '12px 22px', borderRadius: 10, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              + Rent Equipment
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { label: 'Total Bookings', value: stats.total },
              { label: 'Active Rentals', value: stats.active },
              { label: 'Pending Review', value: stats.pending },
              { label: 'Total Spent', value: stats.spent > 0 ? `₹${stats.spent.toLocaleString('en-IN')}` : '—' },
            ].map(stat => (
              <div key={stat.label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Success banner */}
        {justBooked && (
          <div style={{ border: '1px solid rgba(74,222,128,0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, background: 'rgba(74,222,128,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, background: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" fill="none" stroke="#080808" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#4ade80', fontSize: 14 }}>Quote request submitted!</p>
              <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: 13 }}>We'll get back to you within 2 hours with pricing details.</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {bookings.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
              <button key={tab} onClick={() => setFilter(tab)} style={{
                padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                background: filter === tab ? '#f4a261' : 'rgba(255,255,255,0.06)',
                color: filter === tab ? '#0a0a0a' : 'rgba(255,255,255,0.45)',
              }}>
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 12 }}>
                  ({tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Bookings */}
        {filtered.length === 0 && bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 20, background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>📋</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>No bookings yet</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>Browse our catalog and request a quote for your first rental</p>
            <Link href="/catalog" style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '13px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
              Browse Equipment →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>No {filter} bookings found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(booking => {
              const status = STATUS[booking.status] || STATUS.pending
              const equipName = booking.equipment_name || booking.equipment?.name || 'Equipment'
              const equipImg = booking.equipment?.image_url
              const days = booking.start_date && booking.end_date ? calcDays(booking.start_date, booking.end_date) : null
              const date = new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

              return (
                <div key={booking.id} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

                    {/* Image */}
                    <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', background: '#111', flexShrink: 0, position: 'relative' }}>
                      {equipImg
                        ? <Image src={equipImg} alt={equipName} fill sizes="72px" style={{ objectFit: 'cover' }} loading="lazy" />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🚧</div>
                      }
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 3, letterSpacing: '-0.01em' }}>{equipName}</p>
                          {booking.equipment?.category && (
                            <p style={{ fontSize: 12, color: '#f4a261', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{booking.equipment.category}</p>
                          )}
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 100, background: status.color, color: STATUS_TEXT[booking.status], flexShrink: 0 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, display: 'inline-block', animation: status.pulse ? 'pulse 2s infinite' : 'none' }} />
                          {status.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                        {booking.start_date && booking.end_date && (
                          <span>📅 {booking.start_date} → {booking.end_date}{days ? ` · ${days} days` : ''}</span>
                        )}
                        {booking.total_amount > 0 && (
                          <span style={{ color: '#fff', fontWeight: 600 }}>₹{Number(booking.total_amount).toLocaleString('en-IN')}</span>
                        )}
                        <span>Submitted {date}</span>
                      </div>

                      {booking.notes && (
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px', fontStyle: 'italic' }}>"{booking.notes}"</p>
                      )}
                    </div>

                    {/* Cancel */}
                    {booking.status === 'pending' && (
                      <button onClick={() => cancelBooking(booking.id)} style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, flexShrink: 0, transition: 'all 0.2s' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 32, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 4 }}>Need more equipment?</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Browse our full catalog of 50+ machines</p>
          </div>
          <Link href="/catalog" style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
            Browse Catalog →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  )
}