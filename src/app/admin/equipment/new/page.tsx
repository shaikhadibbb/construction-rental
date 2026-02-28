'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewEquipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    daily_rate: '', image_url: ''
  })

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.name || !form.daily_rate || !form.category) {
      setError('Name, category and daily rate are required')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('equipment').insert({
      name: form.name,
      description: form.description,
      category: form.category.toLowerCase(),
      daily_rate: parseFloat(form.daily_rate),
      image_url: form.image_url || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
      is_available: true
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/admin/equipment')
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Equipment</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">

        <div>
          <label className={labelClass}>Equipment Name *</label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. CAT 320 Excavator" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
            <option value="">Select category</option>
            <option value="excavators">Excavators</option>
            <option value="cranes">Cranes</option>
            <option value="forklifts">Forklifts</option>
            <option value="compactors">Compactors</option>
            <option value="telehandlers">Telehandlers</option>
            <option value="compressors">Compressors</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Daily Rate (USD) *</label>
          <input type="number" value={form.daily_rate} onChange={e => set('daily_rate', e.target.value)}
            placeholder="e.g. 450" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Describe the equipment..." rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Image URL</label>
          <input type="url" value={form.image_url} onChange={e => set('image_url', e.target.value)}
            placeholder="https://..." className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Leave empty to use default image</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            {loading ? 'Adding...' : 'Add Equipment'}
          </button>
          <button onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
