'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Equipment = {
  id: string
  name: string
  daily_rate: number
}

export default function BookingForm({ equipment }: { equipment: Equipment }) {
  const router = useRouter()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calcDays = () => {
    if (!startDate || !endDate) return 0
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const days = calcDays()
  const total = days * equipment.daily_rate

  const handleBooking = async () => {
    setError('')
    if (!startDate || !endDate) { setError('Please select both start and end dates'); return }
    if (new Date(endDate) < new Date(startDate)) { setError('End date must be after start date'); return }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        equipment_id: equipment.id,
        start_date: startDate,
        end_date: endDate,
        total_amount: total,
        status: 'confirmed'
      })
      .select()
      .single()

    if (bookingError) {
      setError(bookingError.message)
      setLoading(false)
      return
    }

    // Send confirmation email
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.email,
        userName: user.email?.split('@')[0] || 'Customer',
        equipmentName: equipment.name,
        startDate,
        endDate,
        totalAmount: total,
        days,
        bookingId: booking.id,
      })
    })

    router.push('/dashboard?booked=true')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" min={today} value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input type="date" min={startDate || today} value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {days > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>${equipment.daily_rate}/day x {days} days</span>
            <span>${equipment.daily_rate * days}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-yellow-200 pt-2 mt-2">
            <span>Total</span>
            <span className="text-yellow-600">${total}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <button onClick={handleBooking} disabled={loading || days === 0}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-lg transition-colors">
        {loading ? 'Booking...' : days > 0 ? 'Confirm Booking — $' + total : 'Select dates to book'}
      </button>

      <p className="text-xs text-center text-gray-400">
        A confirmation email will be sent after booking
      </p>
    </div>
  )
}
