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
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e8e8e8' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '72px 24px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#f4a261', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Our Fleet</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12, lineHeight: 1.05 }}>
            Equipment Catalog
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
            Professional-grade machines available for rental across India.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.25)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search equipment..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px 14px 48px', fontSize: 15, color: '#e8e8e8', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <div style={{ width: 200, flexShrink: 0 }} className="cr-sidebar">
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', background: 'rgba(255,255,255,0.02)', position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Filters</p>
                {(category !== 'All' || availableOnly) && (
                  <button onClick={() => { setCategory('All'); setAvailableOnly(false) }}
                    style={{ fontSize: 12, color: '#f4a261', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    Reset
                  </button>
                )}
              </div>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Category</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{
                      textAlign: 'left', padding: '8px 12px', borderRadius: 8, fontSize: 14,
                      fontWeight: category === cat ? 600 : 400, cursor: 'pointer', border: 'none',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                      background: category === cat ? 'rgba(244,162,97,0.12)' : 'transparent',
                      color: category === cat ? '#f4a261' : 'rgba(255,255,255,0.45)',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Availability</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Available only</p>
                  <button onClick={() => setAvailableOnly(!availableOnly)}
                    style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'background 0.2s', background: availableOnly ? '#f4a261' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', top: 2, left: availableOnly ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{filtered.length}</span> machines
                {category !== 'All' && <span style={{ color: '#f4a261' }}> · {category}</span>}
              </p>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ height: 180, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <div style={{ padding: '20px' }}>
                      <div style={{ height: 10, width: 60, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
                      <div style={{ height: 16, width: '70%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ fontSize: 36, marginBottom: 16 }}>🔍</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>No equipment found</p>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>Try adjusting your search or filters</p>
                <button onClick={() => { setCategory('All'); setAvailableOnly(false); setSearch('') }}
                  style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '12px 24px', borderRadius: 10, border: 'none', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {filtered.map(item => <EquipmentCard key={item.id} equipment={item} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.18); }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @media (max-width: 640px) { .cr-sidebar { display: none; } }
      `}</style>
    </div>
  )
}