import { supabase } from '@/lib/supabase'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

export default async function AnalyticsPage() {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, equipment(name, category)')
    .order('created_at', { ascending: true })

  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, category, daily_rate, is_available')

  const totalRevenue = (bookings || [])
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0)

  const stats = {
    revenue: '$' + totalRevenue.toLocaleString(),
    bookings: (bookings || []).length,
    confirmed: (bookings || []).filter(b => b.status === 'confirmed').length,
    pending: (bookings || []).filter(b => b.status === 'pending').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Overview</p>
        <h1 className="text-3xl font-black text-gray-900">Analytics</h1>
        <p className="text-gray-400 mt-1 text-sm">Real-time insights from your booking data</p>
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: stats.revenue, icon: '💰', trend: '+12%', color: 'border-green-200 bg-green-50', val: 'text-green-700' },
          { label: 'Total Bookings', value: stats.bookings, icon: '📋', trend: '+8%', color: 'border-blue-200 bg-blue-50', val: 'text-blue-700' },
          { label: 'Confirmed', value: stats.confirmed, icon: '✅', trend: '+5%', color: 'border-yellow-200 bg-yellow-50', val: 'text-yellow-700' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳', trend: null, color: 'border-gray-200 bg-gray-50', val: 'text-gray-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-5 ${stat.color}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{stat.icon}</span>
              {stat.trend && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{stat.trend}</span>}
            </div>
            <p className={`text-3xl font-black ${stat.val}`}>{stat.value}</p>
            <p className="text-gray-500 text-xs font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts bookings={bookings || []} equipment={equipment || []} />
    </div>
  )
}