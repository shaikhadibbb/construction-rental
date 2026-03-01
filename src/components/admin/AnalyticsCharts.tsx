'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#eab308', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444']

type Booking = {
  id: string
  created_at: string
  total_amount: number
  status: string
  equipment: { name: string; category: string } | null
}

type Equipment = {
  id: string
  name: string
  category: string
  daily_rate: number
  is_available: boolean
}

export default function AnalyticsCharts({
  bookings,
  equipment,
}: {
  bookings: Booking[]
  equipment: Equipment[]
}) {
  // Revenue by month
  const revenueByMonth: Record<string, number> = {}
  bookings
    .filter(b => b.status !== 'cancelled')
    .forEach(b => {
      const month = new Date(b.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
      revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(b.total_amount)
    })
  const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }))

  // Bookings by month
  const bookingsByMonth: Record<string, number> = {}
  bookings.forEach(b => {
    const month = new Date(b.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
    bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1
  })
  const bookingsData = Object.entries(bookingsByMonth).map(([month, count]) => ({ month, count }))

  // Bookings by status
  const statusCount: Record<string, number> = {}
  bookings.forEach(b => {
    statusCount[b.status] = (statusCount[b.status] || 0) + 1
  })
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }))

  // Most booked equipment
  const equipmentCount: Record<string, number> = {}
  bookings.forEach(b => {
    const name = b.equipment?.name || 'Unknown'
    equipmentCount[name] = (equipmentCount[name] || 0) + 1
  })
  const equipmentData = Object.entries(equipmentCount)
    .map(([name, bookings]) => ({ name: name.split(' ').slice(0, 2).join(' '), bookings }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5)

  // Category breakdown
  const categoryCount: Record<string, number> = {}
  equipment.forEach(e => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1
  })
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }))

  // Summary stats
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount), 0)
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length

  return (
    <div className="space-y-8">

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString(), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Bookings', value: bookings.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Confirmed', value: confirmedBookings, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Cancelled', value: cancelledBookings, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(stat => (
          <div key={stat.label} className={'rounded-2xl p-5 ' + stat.bg}>
            <p className={'text-3xl font-bold ' + stat.color}>{stat.value}</p>
            <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-6">Revenue Over Time</h2>
        {revenueData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400">No revenue data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => '$' + v} />
              <Tooltip formatter={(value) => ['$' + value, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bookings per month */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6">Bookings Per Month</h2>
          {bookingsData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">No bookings yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#eab308" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Booking status pie */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6">Booking Status</h2>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">No bookings yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}>
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Most booked equipment */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6">Most Booked Equipment</h2>
          {equipmentData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">No bookings yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={equipmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Equipment by category */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6">Equipment by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => name + ' (' + value + ')'}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
