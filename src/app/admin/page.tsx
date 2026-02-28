import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function AdminPage() {
  const { data: equipment } = await supabase.from('equipment').select('id, is_available')
  const { data: bookings } = await supabase.from('bookings').select('id, status, total_amount')

  const totalEquipment = equipment?.length || 0
  const availableEquipment = equipment?.filter(e => e.is_available).length || 0
  const totalBookings = bookings?.length || 0
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
  const totalRevenue = bookings?.filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0

  const stats = [
    { label: 'Total Equipment', value: totalEquipment, sub: availableEquipment + ' available', color: 'bg-blue-500', link: '/admin/equipment' },
    { label: 'Total Bookings', value: totalBookings, sub: pendingBookings + ' pending', color: 'bg-yellow-500', link: '/admin/bookings' },
    { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString(), sub: 'all time', color: 'bg-green-500', link: '/admin/bookings' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.link} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={'w-10 h-10 rounded-xl ' + stat.color + ' mb-4'}></div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-600 font-medium mt-1">{stat.label}</p>
            <p className="text-sm text-gray-400 mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/equipment/new" className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl p-6 flex items-center gap-4 transition-colors">
          <span className="text-4xl">➕</span>
          <div>
            <p className="font-bold text-lg">Add New Equipment</p>
            <p className="text-yellow-100 text-sm">Add a new item to the catalog</p>
          </div>
        </Link>
        <Link href="/admin/bookings" className="bg-gray-800 hover:bg-gray-700 text-white rounded-2xl p-6 flex items-center gap-4 transition-colors">
          <span className="text-4xl">📋</span>
          <div>
            <p className="font-bold text-lg">Manage Bookings</p>
            <p className="text-gray-400 text-sm">View and update all bookings</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
