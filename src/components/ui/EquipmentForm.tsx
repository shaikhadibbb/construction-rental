'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import type { EquipmentFormData } from '@/types'

export type { EquipmentFormData }

type Props = {
  initialData?: Partial<EquipmentFormData>
  onSave: (data: EquipmentFormData) => Promise<void>
  onDelete?: () => Promise<void>
  saving: boolean
  mode: 'new' | 'edit'
}

/**
 * Reusable equipment create/edit form used in admin/equipment pages.
 * Handles multi-image upload to Supabase Storage.
 */
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
      try {
        const ext = file.name.split('.').pop()
        const fileName = `${uploadId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('equipment-images')
          .upload(fileName, file, { upsert: true })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('equipment-images').getPublicUrl(fileName)
        uploadedUrls.push(urlData.publicUrl)
      } catch (err) {
        setError(err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed')
      }
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  // Shared styles
  const surface: React.CSSProperties = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px' }
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#e8e8e8', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Error banner */}
      {error && (
        <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg style={{ width: 14, height: 14, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      {/* Photos */}
      <div style={surface}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Media</p>
            <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Equipment Photos</h3>
          </div>
          {form.images.length > 0 && (
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              style={{ fontSize: 12, fontWeight: 700, color: '#f4a261', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Add More
            </button>
          )}
        </div>

        {form.images.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', background: '#111' }}>
                <Image src={img} alt={`Equipment photo ${i + 1}`} fill sizes="100px" style={{ objectFit: 'cover' }} loading="lazy" />
                {form.image_url === img && (
                  <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 9, fontWeight: 800, background: '#f4a261', color: '#0a0a0a', padding: '2px 5px', borderRadius: 4 }}>MAIN</span>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6 }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '0')}>
                  {form.image_url !== img && (
                    <button onClick={() => setForm(p => ({ ...p, image_url: img }))} aria-label="Set as main photo"
                      style={{ width: '100%', background: '#f4a261', color: '#0a0a0a', fontSize: 10, fontWeight: 800, border: 'none', borderRadius: 6, padding: '3px 0', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Set Main
                    </button>
                  )}
                  <button
                    onClick={() => setForm(p => ({
                      ...p,
                      images: p.images.filter(u => u !== img),
                      image_url: p.image_url === img ? (p.images.filter(u => u !== img)[0] || '') : p.image_url,
                    }))}
                    aria-label={`Remove photo ${i + 1}`}
                    style={{ width: '100%', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, border: 'none', borderRadius: 6, padding: '3px 0', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} aria-label="Upload equipment photos"
            style={{ width: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 14, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', cursor: 'pointer', transition: 'border-color 0.2s', color: 'rgba(255,255,255,0.35)', fontFamily: 'inherit' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(244,162,97,0.3)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.04)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>📷</div>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Click to upload photos</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>JPG, PNG, WebP — multiple files supported</p>
          </button>
        )}

        {uploading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f4a261', fontSize: 13, marginTop: 12, background: 'rgba(244,162,97,0.08)', borderRadius: 10, padding: '10px 14px' }}>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
            Uploading photos…
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} aria-hidden="true" />
      </div>

      {/* Details */}
      <div style={{ ...surface, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Details</p>

        <div>
          <label htmlFor="ef-name" style={labelStyle}>Equipment Name *</label>
          <input id="ef-name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. CAT 320 Hydraulic Excavator" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>

        <div>
          <label htmlFor="ef-desc" style={labelStyle}>Description</label>
          <textarea id="ef-desc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4} placeholder="Describe the equipment — specifications, condition, what it&apos;s suitable for…"
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>

        <div>
          <p style={labelStyle}>Category *</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.value} type="button" onClick={() => setForm({ ...form, category: cat.value })}
                aria-pressed={form.category === cat.value}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 8px',
                  borderRadius: 10, border: '1px solid', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  background: form.category === cat.value ? 'rgba(244,162,97,0.1)' : 'rgba(255,255,255,0.03)',
                  borderColor: form.category === cat.value ? 'rgba(244,162,97,0.4)' : 'rgba(255,255,255,0.08)',
                }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: form.category === cat.value ? '#f4a261' : 'rgba(255,255,255,0.45)' }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="ef-rate" style={labelStyle}>Daily Rate (₹) *</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 14 }}>₹</span>
            <input id="ef-rate" type="number" value={form.daily_rate} onChange={e => setForm({ ...form, daily_rate: e.target.value })}
              placeholder="0" style={{ ...inputStyle, paddingLeft: 28 }}
              onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
          {form.daily_rate && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>
              Weekly: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>₹{(Number(form.daily_rate) * 7 * 0.9).toFixed(0)}</strong>
              {' · '}Monthly: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>₹{(Number(form.daily_rate) * 30 * 0.8).toFixed(0)}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Availability */}
      <div style={{ ...surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Visibility</p>
          <p style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 3 }}>Available for Rent</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            {form.is_available ? '✅ Showing in catalog' : '🚫 Hidden from catalog'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, is_available: !form.is_available })}
          role="switch"
          aria-checked={form.is_available}
          aria-label="Toggle equipment availability"
          style={{ width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', transition: 'background 0.2s', background: form.is_available ? '#f4a261' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, padding: 0 }}>
          <span style={{ position: 'absolute', top: 3, left: form.is_available ? 26 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }} />
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={handleSubmit} disabled={saving || uploading}
          style={{
            flex: 1, background: saving || uploading ? 'rgba(255,255,255,0.07)' : '#f4a261',
            color: saving || uploading ? 'rgba(255,255,255,0.3)' : '#0a0a0a',
            fontWeight: 800, padding: '14px', borderRadius: 12, border: 'none',
            fontSize: 14, cursor: saving || uploading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          {saving ? (
            <>
              <span style={{ width: 14, height: 14, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Saving…
            </>
          ) : mode === 'new' ? '+ Add Equipment' : '💾 Save Changes'}
        </button>

        {onDelete && (
          <button type="button" onClick={onDelete}
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700, padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, transition: 'all 0.2s' }}>
            🗑️ Delete
          </button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}