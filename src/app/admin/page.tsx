export const revalidate = 0

import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function AdminPage() {
  const { data: equipment } = await supabase.from('equipment').select('id, is_available, category')
  const { data: bookings } = await supabase.from('bookings').select('id, status, total_amount, created_at, customer_name, equipment_name')
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  const totalEquipment = equipment?.length || 0
  const availableEquipment = equipment?.filter(e => e.is_available).length || 0
  const totalBookings = bookings?.length || 0
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0
  const totalRevenue = bookings?.filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0) || 0

  const recentBookings = (bookings || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    confirmed: 'bg-green-50 text-green-700 border border-green-200',
    cancelled: 'bg-red-50 text-red-600 border border-red-200',
    completed: 'bg-gray-100 text-gray-600 border border-gray-200',
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black text-gray-900">Overview</h1>
        </div>
        <Link href="/admin/equipment/new"
          className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
          + Add Equipment
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Equipment', value: totalEquipment, sub: availableEquipment + ' available', icon: '🚧', href: '/admin/equipment', accent: 'border-blue-200 bg-blue-50', val: 'text-blue-700' },
          { label: 'Total Bookings', value: totalBookings, sub: pendingBookings + ' pending review', icon: '📋', href: '/admin/bookings', accent: 'border-yellow-200 bg-yellow-50', val: 'text-yellow-700' },
          { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString(), sub: 'from confirmed bookings', icon: '💰', href: '/admin/bookings', accent: 'border-green-200 bg-green-50', val: 'text-green-700' },
          { label: 'Customers', value: totalUsers || 0, sub: 'registered accounts', icon: '👷', href: '/admin/bookings', accent: 'border-purple-200 bg-purple-50', val: 'text-purple-700' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className={`rounded-2xl border p-5 hover:shadow-md transition-all hover:-translate-y-0.5 ${stat.accent}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className={`text-3xl font-black ${stat.val}`}>{stat.value}</p>
            <p className="text-gray-700 font-semibold text-sm mt-1">{stat.label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Review', value: pendingBookings, color: 'bg-yellow-500', note: 'Need action' },
          { label: 'Confirmed', value: confirmedBookings, color: 'bg-green-500', note: 'Active rentals' },
          { label: 'Unavailable', value: totalEquipment - availableEquipment, color: 'bg-red-400', note: 'Equipment offline' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-black text-lg">{item.value}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{item.label}</p>
              <p className="text-gray-400 text-xs">{item.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-black text-[#0a1628]">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">No bookings yet</p>
              </div>
            ) : recentBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0a1628] rounded-lg flex items-center justify-center text-yellow-500 font-black text-sm flex-shrink-0">
                    {(booking.customer_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{booking.customer_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">{booking.equipment_name || 'Equipment'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="font-black text-[#0a1628] px-1">Quick Actions</h2>
          {[
            { href: '/admin/equipment/new', icon: '➕', title: 'Add Equipment', desc: 'Add new item to catalog', bg: 'bg-yellow-500 hover:bg-yellow-400', text: 'text-[#0a1628]', sub: 'text-yellow-900/60' },
            { href: '/admin/bookings', icon: '📋', title: 'Manage Bookings', desc: pendingBookings + ' pending review', bg: 'bg-[#0a1628] hover:bg-[#0d1e35]', text: 'text-white', sub: 'text-gray-400' },
            { href: '/admin/equipment', icon: '🚧', title: 'Equipment List', desc: totalEquipment + ' items total', bg: 'bg-gray-100 hover:bg-gray-200', text: 'text-gray-900', sub: 'text-gray-400' },
            { href: '/admin/analytics', icon: '📊', title: 'Analytics', desc: 'Revenue & booking charts', bg: 'bg-gray-100 hover:bg-gray-200', text: 'text-gray-900', sub: 'text-gray-400' },
          ].map(action => (
            <Link key={action.href} href={action.href}
              className={`${action.bg} rounded-2xl p-4 flex items-center gap-4 transition-colors`}>
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className={`font-black text-sm ${action.text}`}>{action.title}</p>
                <p className={`text-xs ${action.sub}`}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}