import { supabase } from '@/lib/supabase'
import AdminBookingRow from '@/components/admin/AdminBookingRow'

export default async function AdminBookingsPage() {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, equipment(name, category), profiles(email)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Bookings</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Equipment</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Dates</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings?.map((booking) => (
              <AdminBookingRow key={booking.id} booking={booking} />
            ))}
          </tbody>
        </table>

        {(!bookings || bookings.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
