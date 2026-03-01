'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NewEquipmentPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', category: '', daily_rate: '',
    image_url: '', images: [] as string[], is_available: true,
  })

  const CATEGORIES = ['excavators', 'cranes', 'forklifts', 'compactors', 'telehandlers', 'compressors']

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `new/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('equipment-images').upload(fileName, file, { upsert: true })
      if (uploadError) { setError('Upload failed: ' + uploadError.message); continue }
      const { data: urlData } = supabase.storage.from('equipment-images').getPublicUrl(fileName)
      uploadedUrls.push(urlData.publicUrl)
    }
    if (uploadedUrls.length > 0) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        image_url: prev.image_url || uploadedUrls[0],
      }))
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    setError('')
    if (!form.name || !form.daily_rate) { setError('Name and daily rate are required'); return }
    setSaving(true)
    const { error: err } = await supabase.from('equipment').insert({
      name: form.name, description: form.description, category: form.category,
      daily_rate: Number(form.daily_rate),
      image_url: form.image_url || form.images[0] || '',
      images: form.images, is_available: form.is_available,
    })
    if (err) { setError(err.message) }
    else { router.push('/admin/equipment') }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/equipment" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">← Back</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Equipment</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Photos</label>
          {form.images.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img} alt={'Photo ' + (i + 1)} className="w-full h-full object-cover rounded-xl" />
                  {form.image_url === img && <span className="absolute top-1.5 left-1.5 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">Main</span>}
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {form.image_url !== img && <button onClick={() => setForm(p => ({ ...p, image_url: img }))} className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-lg">Set Main</button>}
                    <button onClick={() => setForm(p => ({ ...p, images: p.images.filter(u => u !== img), image_url: p.image_url === img ? (p.images.filter(u => u !== img)[0] || '') : p.image_url }))} className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg">Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors">
                <span className="text-2xl">+</span>
                <span className="text-xs mt-1">Add</span>
              </button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors">
              <span className="text-4xl mb-2">📷</span>
              <p className="font-medium text-sm">Click to upload photos</p>
              <p className="text-xs mt-1">JPG, PNG, WebP — multiple files supported</p>
            </button>
          )}
          {uploading && <div className="flex items-center gap-2 text-yellow-600 text-sm mt-2"><span className="animate-spin">⏳</span> Uploading...</div>}
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="">Select category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (USD) *</label>
            <input type="number" value={form.daily_rate} onChange={e => setForm({ ...form, daily_rate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Available for Rent</p>
            <p className="text-xs text-gray-400">Toggle to show/hide from catalog</p>
          </div>
          <button onClick={() => setForm({ ...form, is_available: !form.is_available })}
            className={'w-12 h-6 rounded-full transition-colors ' + (form.is_available ? 'bg-yellow-500' : 'bg-gray-200')}>
            <span className={'block w-5 h-5 rounded-full bg-white shadow transform transition-transform mx-0.5 ' + (form.is_available ? 'translate-x-6' : 'translate-x-0')} />
          </button>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-semibold py-3 rounded-xl transition-colors">
          {saving ? 'Saving...' : 'Add Equipment'}
        </button>
      </div>
    </div>
  )
}
