'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const COLORS = ['#eab308', '#0a1628', '#10b981', '#f97316', '#8b5cf6', '#ef4444']

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-black text-base">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

const RevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-yellow-400 font-black text-base">${Number(payload[0].value).toLocaleString()}</p>
      </div>
    )
  }
  return null
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-gray-400">
      <p className="text-3xl mb-2">📊</p>
      <p className="text-sm">{text}</p>
    </div>
  )
}

export default function AnalyticsCharts({ bookings, equipment }: { bookings: Booking[], equipment: Equipment[] }) {

  // Revenue by month
  const revenueByMonth: Record<string, number> = {}
  bookings.filter(b => b.status !== 'cancelled').forEach(b => {
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

  // Status breakdown
  const statusCount: Record<string, number> = {}
  bookings.forEach(b => { statusCount[b.status] = (statusCount[b.status] || 0) + 1 })
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))

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
  equipment.forEach(e => { categoryCount[e.category] = (categoryCount[e.category] || 0) + 1 })
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), value
  }))

  const cardClass = "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"

  return (
    <div className="space-y-6">

      {/* Revenue chart — full width */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-[#0a1628] text-lg">Revenue Over Time</h2>
            <p className="text-gray-400 text-xs mt-0.5">Monthly revenue from confirmed bookings</p>
          </div>
          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center text-lg">💰</div>
        </div>
        {revenueData.length === 0 ? <EmptyState text="No revenue data yet" /> : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + v} />
              <Tooltip content={<RevenueTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#eab308', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bookings per month */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-[#0a1628] text-lg">Bookings Per Month</h2>
              <p className="text-gray-400 text-xs mt-0.5">Total requests received</p>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-lg">📅</div>
          </div>
          {bookingsData.length === 0 ? <EmptyState text="No bookings yet" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bookingsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0a1628" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status breakdown */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-[#0a1628] text-lg">Booking Status</h2>
              <p className="text-gray-400 text-xs mt-0.5">Distribution by current status</p>
            </div>
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center text-lg">📊</div>
          </div>
          {statusData.length === 0 ? <EmptyState text="No bookings yet" /> : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {statusData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-medium text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#0a1628]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Most booked equipment */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-[#0a1628] text-lg">Top Equipment</h2>
              <p className="text-gray-400 text-xs mt-0.5">Most requested machines</p>
            </div>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-lg">🚧</div>
          </div>
          {equipmentData.length === 0 ? <EmptyState text="No bookings yet" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={equipmentData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={75} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#eab308" radius={[0, 6, 6, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Equipment by category */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-[#0a1628] text-lg">Fleet by Category</h2>
              <p className="text-gray-400 text-xs mt-0.5">Equipment distribution</p>
            </div>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-lg">⚙️</div>
          </div>
          {categoryData.length === 0 ? <EmptyState text="No equipment yet" /> : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {categoryData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-medium text-gray-600 capitalize">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#0a1628]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}