'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminEquipmentPage() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEquipment = async () => {
    const { data } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at')
    setEquipment(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  const handleToggle = async (id: string, current: boolean) => {
    await supabase.from('equipment').update({ is_available: !current }).eq('id', id)
    fetchEquipment()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
        <Link
          href="/admin/equipment/new"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          + Add New
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Equipment</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Daily Rate</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {equipment.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">📷</div>
                    )}
                    <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full capitalize">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${item.daily_rate}/day
                </td>
                <td className="px-6 py-4">
                  <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + (item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(item.id, item.is_available)}
                      className={'text-xs font-medium px-3 py-1 rounded-full border transition-colors ' + (item.is_available ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-red-300 text-red-600 hover:bg-red-50')}
                    >
                      {item.is_available ? '✓ Available' : '✗ Unavailable'}
                    </button>
                    <Link
                      href={'/admin/equipment/' + item.id}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}