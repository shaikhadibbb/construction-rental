import { supabaseAnon as supabase } from '@/lib/supabase'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

/**
 * Analytics Page (/admin/analytics)
 * Displays charts and deep insights.
 */
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
    revenue: '₹' + totalRevenue.toLocaleString('en-IN'),
    bookings: (bookings || []).length,
    confirmed: (bookings || []).filter(b => b.status === 'confirmed').length,
    pending: (bookings || []).filter(b => b.status === 'pending').length,
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '24px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Insights</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Real-time business performance and fleet utilization.</p>
      </div>

      {/* Summary KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {[
          { label: 'Total Revenue', value: stats.revenue, icon: '💰', color: '#4ade80' },
          { label: 'Total Bookings', value: stats.bookings, icon: '📋', color: '#60a5fa' },
          { label: 'Confirmed', value: stats.confirmed, icon: '✅', color: '#f4a261' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳', color: '#eab308' },
        ].map(stat => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts bookings={bookings || []} equipment={equipment || []} />
    </div>
  )
}