'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function EditEquipmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    daily_rate: '',
    image_url: '',
    is_available: true,
  })

  useEffect(() => {
    const fetchEquipment = async () => {
      const { data } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setForm({
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          daily_rate: data.daily_rate?.toString() || '',
          image_url: data.image_url || '',
          is_available: data.is_available ?? true,
        })
      }
      setLoading(false)
    }
    fetchEquipment()
  }, [id])

  const handleSave = async () => {
    setError('')
    if (!form.name || !form.daily_rate) {
      setError('Name and daily rate are required')
      return
    }
    setSaving(true)

    const { error: err } = await supabase
      .from('equipment')
      .update({
        name: form.name,
        description: form.description,
        category: form.category,
        daily_rate: Number(form.daily_rate),
        image_url: form.image_url,
        is_available: form.is_available,
      })
      .eq('id', id)

    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/admin/equipment'), 1500)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this equipment? This cannot be undone.')) return
    const { error: err } = await supabase.from('equipment').delete().eq('id', id)
    if (err) { setError(err.message); return }
    router.push('/admin/equipment')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading equipment...
      </div>
    )
  }

  const CATEGORIES = ['excavators', 'cranes', 'forklifts', 'compactors', 'telehandlers', 'compressors']

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/equipment" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            ← Back to Equipment
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Equipment</h1>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          🗑️ Delete
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
          ✅ Equipment updated! Redirecting...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

        {/* Image preview */}
        {form.image_url && (
          <img src={form.image_url} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (USD) *</label>
            <input
              type="number"
              value={form.daily_rate}
              onChange={e => setForm({ ...form, daily_rate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            value={form.image_url}
            onChange={e => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Available for Rent</p>
            <p className="text-xs text-gray-400">Toggle to show/hide from catalog</p>
          </div>
          <button
            onClick={() => setForm({ ...form, is_available: !form.is_available })}
            className={'w-12 h-6 rounded-full transition-colors ' + (form.is_available ? 'bg-yellow-500' : 'bg-gray-200')}
          >
            <span className={'block w-5 h-5 rounded-full bg-white shadow transform transition-transform mx-0.5 ' + (form.is_available ? 'translate-x-6' : 'translate-x-0')} />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
