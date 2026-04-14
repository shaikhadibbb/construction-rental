'use client'

import { useState } from 'react'
import Image from 'next/image'

/**
 * Equipment image gallery with lightbox.
 * Uses Next.js Image for optimised loading.
 */
export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const allImages = images?.length > 0 ? images : []
  if (allImages.length === 0) return null

  const goPrev = () => setSelected(s => (s === 0 ? allImages.length - 1 : s - 1))
  const goNext = () => setSelected(s => (s === allImages.length - 1 ? 0 : s + 1))

  return (
    <>
      {/* Main image */}
      <div
        className="gallery-main"
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        aria-label={`View ${name} image ${selected + 1} of ${allImages.length} — click to zoom`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setLightbox(true) }}
        style={{ position: 'relative', height: 340, borderRadius: 16, overflow: 'hidden', marginBottom: 10, background: '#111', cursor: 'zoom-in' }}>
        <Image
          src={allImages[selected]}
          alt={`${name} — photo ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          style={{ objectFit: 'cover', transition: 'opacity 0.2s' }}
          priority={selected === 0}
        />
        {/* Prev / Next arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); goPrev() }}
              aria-label="Previous photo"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
              ‹
            </button>
            <button
              onClick={e => { e.stopPropagation(); goNext() }}
              aria-label="Next photo"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
              ›
            </button>
            <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 100 }} aria-live="polite">
              {selected + 1} / {allImages.length}
            </div>
          </>
        )}
        <div style={{ position: 'absolute', top: 10, right: 12, background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)', fontSize: 11, padding: '3px 8px', borderRadius: 100 }} aria-hidden="true">
          🔍 Click to zoom
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} role="tablist" aria-label="Photo thumbnails">
          {allImages.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={selected === i}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setSelected(i)}
              style={{
                flexShrink: 0, width: 60, height: 60, borderRadius: 10, overflow: 'hidden',
                border: `2px solid ${selected === i ? '#f4a261' : 'transparent'}`,
                opacity: selected === i ? 1 : 0.55,
                transition: 'all 0.2s', cursor: 'pointer', position: 'relative',
                background: 'none', padding: 0,
                transform: selected === i ? 'scale(1.05)' : 'scale(1)',
              }}>
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill sizes="60px" style={{ objectFit: 'cover' }} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo ${selected + 1} of ${allImages.length} — enlarged view`}>
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close lightbox"
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
          {allImages.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); goPrev() }} aria-label="Previous photo"
                style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ‹
              </button>
              <button onClick={e => { e.stopPropagation(); goNext() }} aria-label="Next photo"
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ›
              </button>
            </>
          )}
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', width: '100%', height: '100%' }} onClick={e => e.stopPropagation()}>
            <Image
              src={allImages[selected]}
              alt={`${name} — photo ${selected + 1}`}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain', borderRadius: 12 }}
            />
          </div>
          <p style={{ position: 'absolute', bottom: 16, color: 'rgba(255,255,255,0.4)', fontSize: 12 }} aria-live="polite">
            {selected + 1} / {allImages.length}
          </p>
        </div>
      )}
    </>
  )
}
