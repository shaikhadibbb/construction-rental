'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EquipmentForm, { EquipmentFormData } from '@/components/ui/EquipmentForm'

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/equipment" className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700 font-semibold mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Equipment
        </Link>
        <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Fleet</p>
        <h1 className="text-3xl font-black text-[#0a1628]">Add New Equipment</h1>
        <p className="text-gray-400 text-sm mt-1">Fill in the details to list a new machine in your catalog</p>
      </div>

      <EquipmentForm mode="new" saving={saving} onSave={handleSave} />
    </div>
  )
}