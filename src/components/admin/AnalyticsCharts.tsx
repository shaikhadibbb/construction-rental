'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import type { TooltipProps } from 'recharts'

const COLORS = ['#f4a261', '#4ade80', '#60a5fa', '#eab308', '#8b5cf6', '#ef4444']

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

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{payload[0].value}</p>
      </div>
    )
  }
  return null
}

const RevenueTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#f4a261', fontWeight: 800, fontSize: 14 }}>₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
      </div>
    )
  }
  return null
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
      <p style={{ fontSize: 32, marginBottom: 8 }}>📊</p>
      <p style={{ fontSize: 13, fontWeight: 500 }}>{text}</p>
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

  const cardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Revenue chart — full width */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Revenue Trend</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Confirmed booking value over time</p>
          </div>
          <div style={{ width: 32, height: 32, background: 'rgba(244,162,97,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💰</div>
        </div>
        {revenueData.length === 0 ? <EmptyState text="Not enough data for chart" /> : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f4a261" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f4a261" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + v} />
              <Tooltip content={<RevenueTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f4a261" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#f4a261', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>

        {/* Bookings per month */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Monthly Volume</h2>
            <div style={{ width: 32, height: 32, background: 'rgba(96,165,250,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
          </div>
          {bookingsData.length === 0 ? <EmptyState text="No bookings yet" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bookingsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status breakdown */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Booking Status</h2>
            <div style={{ width: 32, height: 32, background: 'rgba(74,222,128,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📊</div>
          </div>
          {statusData.length === 0 ? <EmptyState text="No data" /> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: '50%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={4} stroke="none">
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {statusData.map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Most booked equipment */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Popular Machines</h2>
            <div style={{ width: 32, height: 32, background: 'rgba(244,162,97,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔥</div>
          </div>
          {equipmentData.length === 0 ? <EmptyState text="No data" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={equipmentData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 600 }} width={80} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#f4a261" radius={[0, 4, 4, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Equipment by category */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Fleet Mix</h2>
            <div style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</div>
          </div>
          {categoryData.length === 0 ? <EmptyState text="No equipment" /> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: '50%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={4} stroke="none">
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {categoryData.map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'capitalize' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{item.value}</span>
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