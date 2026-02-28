'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

export default function AdminBookingRow({ booking }: { booking: any }) {
  const [status, setStatus] = useState(booking.status)

  const updateStatus = async (newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', booking.id)
    setStatus(newStatus)
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-600">
        {booking.profiles?.email || 'Unknown'}
      </td>
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900 text-sm">{booking.equipment?.name}</p>
        <p className="text-xs text-gray-400 capitalize">{booking.equipment?.category}</p>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {booking.start_date} → {booking.end_date}
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900">
        ${booking.total_amount}
      </td>
      <td className="px-6 py-4">
        <select
          value={status}
          onChange={e => updateStatus(e.target.value)}
          className={'text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ' + (STATUS_STYLES[status] || 'bg-gray-100')}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
    </tr>
  )
}
