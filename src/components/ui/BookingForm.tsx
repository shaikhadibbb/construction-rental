'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Equipment } from '@/types'

type Props = {
  equipment: Pick<Equipment, 'id' | 'name' | 'daily_rate'>
}

/**
 * Authenticated booking form for a specific equipment item.
 * Calculates total cost from date range, requires login before submitting.
 */
export default function BookingForm({ equipment }: Props) {
  const router = useRouter()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [creditsBalance, setCreditsBalance] = useState(0)
  const [useCredits, setUseCredits] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('credits_balance').eq('id', user.id).single().then(({ data }) => {
          if (data) setCreditsBalance(data.credits_balance || 0)
        })
      }
    })
  }, [])

  const calcDays = () => {
    if (!startDate || !endDate) return 0
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
  }

  const days = calcDays()
  const total = days * equipment.daily_rate
  const creditsToUse = useCredits ? Math.min(creditsBalance, total) : 0
  const finalTotal = total - creditsToUse

  const handleBooking = async () => {
    setError('')
    if (!startDate || !endDate) { setError('Please select both start and end dates'); return }
    if (new Date(endDate) < new Date(startDate)) { setError('End date must be after start date'); return }
    if (loading) return // Prevent double-submission

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Fire secure transaction RPC
      const { data: bookingData, error: bookingError } = await supabase.rpc('spend_credits_and_book', {
        p_user_id: user.id,
        p_equipment_id: equipment.id,
        p_start_date: startDate,
        p_end_date: endDate,
        p_total_before_discount: total,
        p_credits_to_use: creditsToUse
      })

      if (bookingError) throw bookingError
      
      const bookingId = bookingData.booking_id

      // Send confirmation email (non-blocking)
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          userName: user.email?.split('@')[0] || 'Customer',
          equipmentName: equipment.name,
          startDate,
          endDate,
          totalAmount: finalTotal,
          days,
          bookingId: bookingId,
        }),
      }).catch(console.error) // Fire-and-forget

      router.push('/dashboard?booked=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const inputStyle: React.CSSProperties = {
    width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8e8e8', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: 'rgba(255,255,255,0.45)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label htmlFor="booking-start" style={labelStyle}>Start Date</label>
        <input
          id="booking-start"
          type="date"
          min={today}
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>
      <div>
        <label htmlFor="booking-end" style={labelStyle}>End Date</label>
        <input
          id="booking-end"
          type="date"
          min={startDate || today}
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      {days > 0 && (
        <div style={{ background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.2)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            <span>₹{equipment.daily_rate.toLocaleString('en-IN')}/day × {days} day{days !== 1 ? 's' : ''}</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          {creditsBalance > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#fff', background: 'rgba(74,222,128,0.1)', padding: '10px 12px', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(74,222,128,0.2)', cursor: 'pointer' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={useCredits} onChange={e => setUseCredits(e.target.checked)} style={{ accentColor: '#4ade80', width: 14, height: 14 }} />
                <span>Use Contractor Credits (Balance: ₹{creditsBalance.toLocaleString('en-IN')})</span>
              </span>
              {useCredits && <span style={{ color: '#4ade80', fontWeight: 700 }}>-₹{creditsToUse.toLocaleString('en-IN')}</span>}
            </label>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            <span>Contractor Credits Earned (2%)</span>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>+₹{Math.round(finalTotal * 0.02).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#fff', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
            <span>Total Payable</span>
            <span style={{ color: '#f4a261' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading || days === 0}
        style={{
          width: '100%', background: days === 0 ? 'rgba(255,255,255,0.07)' : '#f4a261',
          color: days === 0 ? 'rgba(255,255,255,0.3)' : '#0a0a0a',
          fontWeight: 700, padding: '14px', borderRadius: 10, border: 'none',
          fontSize: 14, cursor: loading || days === 0 ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        {loading ? (
          <>
            <span style={{ width: 16, height: 16, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Booking…
          </>
        ) : days > 0 ? (
          `Confirm Booking — ₹${finalTotal.toLocaleString('en-IN')}`
        ) : (
          'Select dates to book'
        )}
      </button>

      <p style={{ fontSize: 12, textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
        A confirmation email will be sent after booking
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
