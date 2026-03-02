'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EquipmentCard from '@/components/ui/EquipmentCard'

const CATEGORIES = ['All', 'Excavators', 'Cranes', 'Forklifts', 'Compactors', 'Telehandlers', 'Compressors']

type Equipment = {
  id: string
  name: string
  description: string
  category: string
  daily_rate: number
  image_url: string
  is_available: boolean
}

export default function CatalogPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true)
      let query = supabase.from('equipment').select('*').order('created_at')
      if (category !== 'All') query = query.eq('category', category.toLowerCase())
      if (availableOnly) query = query.eq('is_available', true)
      const { data } = await query
      setEquipment(data || [])
      setLoading(false)
    }
    fetchEquipment()
  }, [category, availableOnly])

  const filtered = equipment.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-2">Our Fleet</p>
          <h1 className="text-4xl font-black text-white mb-2">Equipment Catalog</h1>
          <p className="text-gray-400">Professional-grade machines available for rental across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search */}
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, description, category..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar filters */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-[#0a1628]">Filters</h3>
                {(category !== 'All' || availableOnly) && (
                  <button onClick={() => { setCategory('All'); setAvailableOnly(false) }}
                    className="text-xs text-yellow-600 font-semibold hover:text-yellow-700">Reset</button>
                )}
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                        (category === cat ? 'bg-[#0a1628] text-yellow-500' : 'text-gray-600 hover:bg-gray-50')}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Availability</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Available only</p>
                  <button onClick={() => setAvailableOnly(!availableOnly)}
                    className={'w-11 h-6 rounded-full transition-colors ' + (availableOnly ? 'bg-yellow-500' : 'bg-gray-200')}>
                    <span className={'block w-5 h-5 rounded-full bg-white shadow transform transition-transform mx-0.5 ' + (availableOnly ? 'translate-x-5' : 'translate-x-0')} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment grid */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-900">{filtered.length}</span> items
                {category !== 'All' && <span className="text-yellow-600 font-semibold"> in {category}</span>}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="h-48 bg-gray-100 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                      <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                      <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-xl font-bold text-gray-800 mb-2">No equipment found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
                <button onClick={() => { setCategory('All'); setAvailableOnly(false); setSearch('') }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(item => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}