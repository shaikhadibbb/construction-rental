'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { value: 'excavators', label: 'Excavators', icon: '🚧' },
  { value: 'cranes', label: 'Cranes', icon: '🏗️' },
  { value: 'forklifts', label: 'Forklifts', icon: '🚜' },
  { value: 'compactors', label: 'Compactors', icon: '🛞' },
  { value: 'telehandlers', label: 'Telehandlers', icon: '🔧' },
  { value: 'compressors', label: 'Compressors', icon: '⚙️' },
]

export type EquipmentFormData = {
  name: string
  description: string
  category: string
  daily_rate: string
  image_url: string
  images: string[]
  is_available: boolean
}

type Props = {
  initialData?: Partial<EquipmentFormData>
  onSave: (data: EquipmentFormData) => Promise<void>
  onDelete?: () => Promise<void>
  saving: boolean
  mode: 'new' | 'edit'
}

export default function EquipmentForm({ initialData, onSave, onDelete, saving, mode }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<EquipmentFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    daily_rate: initialData?.daily_rate || '',
    image_url: initialData?.image_url || '',
    images: initialData?.images || [],
    is_available: initialData?.is_available ?? true,
  })

  const uploadId = initialData ? 'edit' : 'new'

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    const uploadedUrls: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${uploadId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
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

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) { setError('Equipment name is required'); return }
    if (!form.daily_rate) { setError('Daily rate is required'); return }
    if (!form.category) { setError('Please select a category'); return }
    try {
      await onSave(form)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"

  return (
    <div className="space-y-6">

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      {/* Photos section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">Media</p>
            <h3 className="font-black text-[#0a1628]">Equipment Photos</h3>
          </div>
          {form.images.length > 0 && (
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="text-xs font-bold text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-3 py-1.5 rounded-lg transition-colors">
              + Add More
            </button>
          )}
        </div>

        {form.images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={img} alt={'Photo ' + (i + 1)} className="w-full h-full object-cover rounded-xl border border-gray-200" />
                {form.image_url === img && (
                  <span className="absolute top-1.5 left-1.5 bg-yellow-500 text-[#0a1628] text-xs px-1.5 py-0.5 rounded-full font-black">Main</span>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  {form.image_url !== img && (
                    <button onClick={() => setForm(p => ({ ...p, image_url: img }))}
                      className="w-full bg-yellow-500 text-[#0a1628] text-xs px-2 py-1 rounded-lg font-bold">
                      Set Main
                    </button>
                  )}
                  <button onClick={() => setForm(p => ({
                    ...p,
                    images: p.images.filter(u => u !== img),
                    image_url: p.image_url === img ? (p.images.filter(u => u !== img)[0] || '') : p.image_url
                  }))} className="w-full bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="w-full border-2 border-dashed border-gray-200 hover:border-yellow-400 rounded-2xl py-12 flex flex-col items-center justify-center text-gray-400 hover:text-yellow-500 transition-colors group">
            <div className="w-14 h-14 bg-gray-100 group-hover:bg-yellow-50 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-colors">📷</div>
            <p className="font-bold text-sm">Click to upload photos</p>
            <p className="text-xs mt-1 text-gray-400">JPG, PNG, WebP — multiple files supported</p>
          </button>
        )}

        {uploading && (
          <div className="flex items-center gap-2 text-yellow-600 text-sm mt-3 bg-yellow-50 rounded-xl px-4 py-2.5">
            <span className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            Uploading photos...
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      </div>

      {/* Details section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Details</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Equipment Name *</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. CAT 320 Hydraulic Excavator" className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4} placeholder="Describe the equipment — specifications, condition, what it's suitable for..."
            className={inputClass + ' resize-none'} />
        </div>

        {/* Category — visual picker */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Category *</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setForm({ ...form, category: cat.value })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                  form.category === cat.value
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}>
                <span className="text-xl">{cat.icon}</span>
                <span className={`text-xs font-bold ${form.category === cat.value ? 'text-yellow-700' : 'text-gray-600'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Daily Rate (USD) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
            <input type="number" value={form.daily_rate} onChange={e => setForm({ ...form, daily_rate: e.target.value })}
              placeholder="0" className={inputClass + ' pl-8'} />
          </div>
          {form.daily_rate && (
            <p className="text-xs text-gray-400 mt-1">
              Weekly: <strong>${(Number(form.daily_rate) * 7 * 0.9).toFixed(0)}</strong> · Monthly: <strong>${(Number(form.daily_rate) * 30 * 0.8).toFixed(0)}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Availability toggle */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Visibility</p>
            <p className="font-black text-[#0a1628]">Available for Rent</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {form.is_available ? '✅ Showing in catalog' : '🚫 Hidden from catalog'}
            </p>
          </div>
          <button onClick={() => setForm({ ...form, is_available: !form.is_available })}
            className={`w-14 h-7 rounded-full transition-colors flex-shrink-0 ${form.is_available ? 'bg-yellow-500' : 'bg-gray-200'}`}>
            <span className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform mx-0.5 ${form.is_available ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleSubmit} disabled={saving || uploading}
          className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a1628] font-black py-4 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/25 text-sm">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : mode === 'new' ? '+ Add Equipment' : '💾 Save Changes'}
        </button>

        {onDelete && (
          <button onClick={onDelete}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-5 py-4 rounded-xl transition-colors border border-red-200 text-sm">
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}