'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EquipmentCard from '@/components/ui/EquipmentCard'
import Link from 'next/link'

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
  const [maxPrice, setMaxPrice] = useState(1000)
  const [availableOnly, setAvailableOnly] = useState(false)

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true)
      let query = supabase.from('equipment').select('*').order('created_at')

      if (category !== 'All') {
        query = query.eq('category', category.toLowerCase())
      }
      if (availableOnly) {
        query = query.eq('is_available', true)
      }

      const { data } = await query
      setEquipment(data || [])
      setLoading(false)
    }
    fetchEquipment()
  }, [category, availableOnly])

  const filtered = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesPrice = item.daily_rate <= maxPrice
    return matchesSearch && matchesPrice
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Equipment Catalog</h1>
        <p className="text-gray-500">{filtered.length} items available for rent</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search equipment by name or description..."
          className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar filters */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

            {/* Category */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Category</p>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ' +
                      (category === cat
                        ? 'bg-yellow-500 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100')
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Max Daily Rate: <span className="text-yellow-600 font-bold">${maxPrice}</span>
              </p>
              <input
                type="range"
                min={50}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$50</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Availability toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Available only</p>
              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className={
                  'w-11 h-6 rounded-full transition-colors ' +
                  (availableOnly ? 'bg-yellow-500' : 'bg-gray-200')
                }
              >
                <span className={
                  'block w-5 h-5 rounded-full bg-white shadow transform transition-transform mx-0.5 ' +
                  (availableOnly ? 'translate-x-5' : 'translate-x-0')
                } />
              </button>
            </div>

            {/* Reset filters */}
            {(category !== 'All' || maxPrice !== 1000 || availableOnly || search) && (
              <button
                onClick={() => { setCategory('All'); setMaxPrice(1000); setAvailableOnly(false); setSearch('') }}
                className="w-full mt-4 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* Equipment grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-xl font-semibold text-gray-600 mb-2">No equipment found</p>
              <p className="text-sm mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => { setCategory('All'); setMaxPrice(1000); setAvailableOnly(false); setSearch('') }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Clear filters
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
  )
}
