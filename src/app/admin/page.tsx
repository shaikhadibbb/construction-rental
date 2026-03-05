'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchEquipment = async () => {
    const { data } = await supabase.from('equipment').select('*').order('created_at')
    setEquipment(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEquipment() }, [])

  const handleToggle = async (id: string, current: boolean) => {
    setToggling(id)
    await supabase.from('equipment').update({ is_available: !current }).eq('id', id)
    await fetchEquipment()
    setToggling(null)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    await supabase.from('equipment').delete().eq('id', id)
    await fetchEquipment()
    setDeleting(null)
  }

  const filtered = equipment.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const available = equipment.filter(e => e.is_available).length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading equipment...</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Fleet</p>
          <h1 className="text-3xl font-black text-gray-900">Equipment</h1>
          <p className="text-gray-400 text-sm mt-0.5">{available} available · {equipment.length} total</p>
        </div>
        <Link href="/admin/equipment/new"
          className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-5 py-2.5 rounded-xl transition-colors text-sm">
          + Add New
        </Link>
      </div>

      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or category..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Equipment</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Rate</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="font-medium">No equipment found</p>
                </td>
              </tr>
            ) : filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🚧</div>
                      }
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400 capitalize sm:hidden">{item.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full capitalize">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm font-black text-[#0a1628]">${item.daily_rate}</span>
                  <span className="text-xs text-gray-400">/day</span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggle(item.id, item.is_available)}
                    disabled={toggling === item.id}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      item.is_available
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    } ${toggling === item.id ? 'opacity-50' : ''}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.is_available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    {toggling === item.id ? '...' : item.is_available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={'/admin/equipment/' + item.id}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      Edit
                    </Link>
                    <Link href={'/catalog/' + item.id} target="_blank"
                      className="text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </Link>
                    <button onClick={() => handleDelete(item.id, item.name)}
                      disabled={deleting === item.id}
                      className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                      {deleting === item.id ? '...' : 'Delete'}
                    </button>
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