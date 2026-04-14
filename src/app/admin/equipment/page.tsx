'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Equipment } from '@/types'

/** Admin equipment list page — dark themed */
export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchEquipment = async () => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      if (fetchErr) throw fetchErr
      setEquipment(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEquipment() }, [])

  const handleToggle = async (id: string, current: boolean) => {
    setToggling(id)
    try {
      const { error: updateErr } = await supabase
        .from('equipment')
        .update({ is_available: !current })
        .eq('id', id)
      if (updateErr) throw updateErr
      setEquipment(prev => prev.map(e => e.id === id ? { ...e, is_available: !current } : e))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const { error: deleteErr } = await supabase.from('equipment').delete().eq('id', id)
      if (deleteErr) throw deleteErr
      setEquipment(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = equipment.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const available = equipment.filter(e => e.is_available).length

  const cell: React.CSSProperties = { padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }
  const thStyle: React.CSSProperties = { padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.07)' }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading equipment…</p>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Fleet</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Equipment</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{available} available · {equipment.length} total</p>
        </div>
        <Link href="/admin/equipment/new"
          style={{ background: '#f4a261', color: '#0a0a0a', fontWeight: 800, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          + Add Equipment
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.25)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or category…"
          aria-label="Search equipment"
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 36px 10px 40px', fontSize: 14, color: '#e8e8e8', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex' }}>
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Equipment</th>
                <th style={{ ...thStyle, display: 'none' }} className="sm-show">Category</th>
                <th style={{ ...thStyle, display: 'none' }} className="md-show">Rate</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...cell, textAlign: 'center', padding: '60px 24px' }}>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>🔍</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>No equipment found</p>
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td style={cell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#111', flexShrink: 0, position: 'relative' }}>
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="44px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚧</div>
                        )}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 2 }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize' }}>{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...cell, display: 'none' }} className="sm-show">
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f4a261', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', padding: '3px 8px', borderRadius: 100, textTransform: 'capitalize' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ ...cell, display: 'none' }} className="md-show">
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>₹{item.daily_rate.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>/day</span>
                  </td>
                  <td style={cell}>
                    <button
                      onClick={() => handleToggle(item.id, item.is_available)}
                      disabled={toggling === item.id}
                      aria-label={`Toggle availability for ${item.name}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 100, border: '1px solid', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                        background: item.is_available ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                        borderColor: item.is_available ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)',
                        color: item.is_available ? '#4ade80' : '#f87171',
                        opacity: toggling === item.id ? 0.5 : 1,
                      }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.is_available ? '#4ade80' : '#f87171', flexShrink: 0, animation: item.is_available ? 'pulse-dot 2s infinite' : 'none' }} />
                      {toggling === item.id ? '…' : item.is_available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td style={cell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Link href={`/admin/equipment/${item.id}`}
                        style={{ fontSize: 12, fontWeight: 700, color: '#f4a261', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', padding: '5px 10px', borderRadius: 7, textDecoration: 'none' }}>
                        Edit
                      </Link>
                      <Link href={`/catalog/${item.id}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 10px', borderRadius: 7, textDecoration: 'none' }}>
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deleting === item.id}
                        aria-label={`Delete ${item.name}`}
                        style={{ fontSize: 12, fontWeight: 700, color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting === item.id ? 0.5 : 1 }}>
                        {deleting === item.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) { .sm-show { display: table-cell !important; } }
        @media (min-width: 768px) { .md-show { display: table-cell !important; } }
      `}</style>
    </div>
  )
}