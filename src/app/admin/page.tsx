import { supabaseAnon as supabase } from '@/lib/supabase'
import Link from 'next/link'

/**
 * Admin Dashboard - Home Page (/admin)
 * Provides a high-level overview of the platform status.
 */
export default async function AdminDashboardPage() {
  const [equipResult, bookingsResult, reviewsResult] = await Promise.all([
    supabase.from('equipment').select('id, is_available'),
    supabase.from('bookings').select('id, status, total_amount, created_at').order('created_at', { ascending: false }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
  ])

  const equipment = equipResult.data || []
  const bookings = bookingsResult.data || []
  const reviewsCount = reviewsResult.count || 0

  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0)

  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const recentBookings = bookings.slice(0, 5)

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '24px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome Header */}
      <div>
        <p style={{ fontSize: 11, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Overview</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Welcome back. Here is what is happening with ConstructRent today.</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>💰</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: 4 }}>Total</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 2 }}>₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Total Revenue</p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>📋</span>
            {pendingBookings > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#eab308', background: 'rgba(234,179,8,0.1)', padding: '2px 8px', borderRadius: 4, animation: 'pulse-dot 2s infinite' }}>{pendingBookings} Action Required</span>
            )}
          </div>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{bookings.length}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Total Bookings</p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>🚧</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{equipment.length}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Active Machines</p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>💬</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{reviewsCount}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>Verified Reviews</p>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* Recent Bookings */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Recent Activity</h2>
            <Link href="/admin/bookings" style={{ fontSize: 12, color: '#f4a261', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentBookings.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Booking #{b.id.slice(0, 8)}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: b.status === 'pending' ? '#eab308' : '#4ade80' }}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Link href="/admin/equipment/new" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', borderRadius: 14, textDecoration: 'none' }}>
                <span style={{ fontSize: 24 }}>➕</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f4a261' }}>New Machine</span>
              </Link>
              <Link href="/admin/analytics" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, textDecoration: 'none' }}>
                <span style={{ fontSize: 24 }}>📈</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Analytics</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(8,8,8,1) 0%, rgba(20,20,20,1) 100%)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</h2>
            <div style={{ display: 'flex', itemsCenter: 'center', gap: 10, padding: '10px 14px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#4ade80' }}>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
