'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EquipmentForm from '@/components/ui/EquipmentForm'
import type { EquipmentFormData } from '@/types'

export default function NewEquipmentPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: EquipmentFormData) => {
    setSaving(true)
    const { error } = await supabase.from('equipment').insert({
      name: data.name,
      description: data.description,
      category: data.category,
      daily_rate: Number(data.daily_rate),
      image_url: data.image_url || data.images[0] || '',
      images: data.images,
      is_available: data.is_available,
    })
    setSaving(false)
    if (error) throw new Error(error.message)
    router.push('/admin/equipment')
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/admin/equipment" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f4a261', textDecoration: 'none', fontWeight: 700, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>‹</span> Back to Fleet
        </Link>
        <p style={{ fontSize: 10, color: '#f4a261', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>Inventory</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Add New Asset</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>List a new machine in your rental catalog.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px' }}>
        <EquipmentForm mode="new" saving={saving} onSave={handleSave} />
      </div>
    </div>
  )
}