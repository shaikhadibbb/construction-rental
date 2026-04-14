'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Booking, BookingStatus } from '@/types'

const STATUS_CONFIG: Record<string, { bg: string; border: string; color: string; dot: string; label: string }> = {
  pending:   { bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.25)',   color: '#eab308', dot: '#eab308', label: 'Pending'   },
  confirmed: { bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)',  color: '#4ade80', dot: '#4ade80', label: 'Confirmed' },
  completed: { bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  color: '#60a5fa', dot: '#60a5fa', label: 'Completed' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   color: '#f87171', dot: '#f87171', label: 'Cancelled' },
}

const ALL_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

/** Admin bookings management page — dark themed */
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchBookings = async () => {
    setError('')
    try {
      const { data, error: fetchErr } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      if (fetchErr) throw fetchErr
      setBookings((data as Booking[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    setUpdating(id)
    try {
      const { error: updateErr } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)
      if (updateErr) throw updateErr
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed')
    } finally {
      setUpdating(null)
    }
  }

  const counts = {
    all: bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => {
      if (!search) return true
      const s = search.toLowerCase()
      return (
        (b.customer_name || '').toLowerCase().includes(s) ||
        (b.customer_email || '').toLowerCase().includes(s) ||
        (b.customer_phone || '').toLowerCase().includes(s) ||
        (b.equipment_name || '').toLowerCase().includes(s)
      )
    })

  type TabKey = 'all' | BookingStatus
  const tabs: TabKey[] = ['all', ...ALL_STATUSES]

  const surface: React.CSSProperties = { background: 'var(--surface-0)', border: '1px solid var(--border-subtle)', borderRadius: 14, boxShadow: 'var(--shadow-soft)' }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading bookings…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Requests</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>All Bookings</h1>
          {counts.pending > 0 && (
            <p style={{ fontSize: 13, color: '#eab308', fontWeight: 600 }}>⚡ {counts.pending} pending review</p>
          )}
        </div>
        <button
          onClick={fetchBookings}
          aria-label="Refresh bookings"
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
          <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }} role="tablist" aria-label="Filter bookings by status">
        {tabs.map(tab => {
          const active = filter === tab
          const cfg = tab !== 'all' ? STATUS_CONFIG[tab] : null
          return (
            <button key={tab} role="tab" aria-selected={active} onClick={() => setFilter(tab)}
              style={{
                padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1px solid', fontFamily: 'inherit', transition: 'all 0.2s',
                background: active ? (cfg?.bg ?? '#f4a261') : 'rgba(255,255,255,0.04)',
                borderColor: active ? (cfg?.border ?? 'rgba(244,162,97,0.4)') : 'rgba(255,255,255,0.08)',
                color: active ? (cfg?.color ?? '#f4a261') : 'rgba(255,255,255,0.4)',
              }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span style={{ marginLeft: 5, opacity: 0.6, fontSize: 11 }}>({counts[tab]})</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.25)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or equipment…"
          aria-label="Search bookings"
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 36px 10px 40px', fontSize: 14, color: '#e8e8e8', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
        {search && (
          <button onClick={() => setSearch('')} aria-label="Clear search"
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex' }}>
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div style={{ ...surface, textAlign: 'center', padding: '60px 24px' }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>📋</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>They will appear here when submitted</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(booking => {
            const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
            const isExpanded = expanded === booking.id
            const date = new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            const time = new Date(booking.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            const initial = ((booking.customer_name || booking.customer_email || '?')[0]).toUpperCase()

            return (
              <div key={booking.id} style={{ ...surface, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>

                    {/* Avatar */}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(244,162,97,0.15)', border: '1px solid rgba(244,162,97,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#f4a261', flexShrink: 0 }}>
                      {initial}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                        <div>
                          <p style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 3 }}>{booking.customer_name || 'Unknown'}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            {booking.customer_email && (
                              <a href={`mailto:${booking.customer_email}`} style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none' }}>{booking.customer_email}</a>
                            )}
                            {booking.customer_phone && (
                              <a href={`tel:${booking.customer_phone}`} style={{ fontSize: 12, color: '#4ade80', textDecoration: 'none', fontWeight: 600 }}>
                                📞 {booking.customer_phone}
                              </a>
                            )}
                          </div>
                        </div>
                        {/* Status badge */}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: status.bg, border: `1px solid ${status.border}`, color: status.color, flexShrink: 0 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
                          {status.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>🚧 {booking.equipment_name || '—'}</span>
                        {booking.start_date && (
                          <span>📅 {booking.start_date}{booking.end_date ? ` → ${booking.end_date}` : ''}</span>
                        )}
                        {booking.total_amount > 0 && (
                          <span style={{ color: '#f4a261', fontWeight: 700 }}>₹{Number(booking.total_amount).toLocaleString('en-IN')}</span>
                        )}
                        <span>{date} at {time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status:</span>
                      {ALL_STATUSES.map(s => {
                        const cfg = STATUS_CONFIG[s]
                        const isCurrent = booking.status === s
                        return (
                          <button key={s}
                            onClick={() => updateStatus(booking.id, s)}
                            disabled={isCurrent || updating === booking.id}
                            style={{
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7, border: '1px solid', cursor: isCurrent ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                              background: isCurrent ? cfg.bg : 'rgba(255,255,255,0.03)',
                              borderColor: isCurrent ? cfg.border : 'rgba(255,255,255,0.08)',
                              color: isCurrent ? cfg.color : 'rgba(255,255,255,0.35)',
                              opacity: updating === booking.id && !isCurrent ? 0.4 : 1,
                            }}>
                            {updating === booking.id && !isCurrent ? '…' : cfg.label}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : booking.id)}
                      aria-label={isExpanded ? 'Collapse booking details' : 'Expand booking details'}
                      aria-expanded={isExpanded}
                      style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                      {isExpanded ? 'Less' : 'Details'}
                      <svg style={{ width: 12, height: 12, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                </div>

                {/* Expanded panel */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Notes</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: booking.notes ? 'italic' : 'normal' }}>{booking.notes || 'No notes provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Booking ID</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{booking.id}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {booking.customer_email && (
                        <a href={`mailto:${booking.customer_email}?subject=Re: Your Equipment Rental Quote`}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa', fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>
                          ✉️ Email Customer
                        </a>
                      )}
                      {booking.customer_phone && (
                        <a href={`tel:${booking.customer_phone}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>
                          📞 Call Customer
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}