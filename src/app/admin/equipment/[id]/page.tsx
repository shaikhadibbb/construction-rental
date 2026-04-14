'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EquipmentForm from '@/components/ui/EquipmentForm'
import type { EquipmentFormData } from '@/types'
import { deleteEquipment, saveEquipment } from '../actions'

export default function EditEquipmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [initialData, setInitialData] = useState<Partial<EquipmentFormData> | null>(null)

  useEffect(() => {
    const fetchEquipment = async () => {
      const { data } = await supabase.from('equipment').select('*').eq('id', id).single()
      if (data) {
        setInitialData({
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          daily_rate: data.daily_rate?.toString() || '',
          image_url: data.image_url || '',
          images: data.images || [],
          is_available: data.is_available ?? true,
        })
      }
      setLoading(false)
    }
    fetchEquipment()
  }, [id])

  const handleSave = async (data: EquipmentFormData) => {
    setSaving(true)
    try {
      await saveEquipment(id, {
        name: data.name, description: data.description, category: data.category,
        daily_rate: Number(data.daily_rate),
        image_url: data.image_url || data.images[0] || '',
        images: data.images, is_available: data.is_available,
      })
      setSuccess(true)
      setTimeout(() => router.push('/admin/equipment'), 1200)
    } catch (err) {
      console.error(err)
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this equipment? This cannot be undone.')) return
    try {
      await deleteEquipment(id)
      router.push('/admin/equipment')
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Fetching asset data…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/admin/equipment" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f4a261', textDecoration: 'none', fontWeight: 700, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>‹</span> Back to Fleet
        </Link>
        <p style={{ fontSize: 10, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>Fleet Manager</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Edit Details</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Update metadata and availability for this machine.</p>
      </div>

      {success && (
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', borderRadius: 14, padding: '14px 20px', marginBottom: 24, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          ✅ Changes saved! Redirecting to fleet...
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px' }}>
        {initialData && (
          <EquipmentForm mode="edit" initialData={initialData} saving={saving} onSave={handleSave} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}