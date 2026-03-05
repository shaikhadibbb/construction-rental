'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EquipmentForm, { EquipmentFormData } from '@/components/ui/EquipmentForm'
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
    await saveEquipment(id, {
      name: data.name, description: data.description, category: data.category,
      daily_rate: Number(data.daily_rate),
      image_url: data.image_url || data.images[0] || '',
      images: data.images, is_available: data.is_available,
    })
    setSaving(false)
    setSuccess(true)
    setTimeout(() => router.push('/admin/equipment'), 1500)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this equipment? This cannot be undone.')) return
    await deleteEquipment(id)
    router.push('/admin/equipment')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading equipment...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/equipment" className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700 font-semibold mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Equipment
        </Link>
        <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Fleet</p>
        <h1 className="text-3xl font-black text-[#0a1628]">Edit Equipment</h1>
        <p className="text-gray-400 text-sm mt-1">Update the details for this machine</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Saved! Redirecting...
        </div>
      )}

      {initialData && (
        <EquipmentForm mode="edit" initialData={initialData} saving={saving} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  )
}