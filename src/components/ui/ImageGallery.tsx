'use client'

import { useState } from 'react'

export default function ImageGallery({ images, name }: { images: string[], name: string }) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const allImages = images?.length > 0 ? images : []
  if (allImages.length === 0) return null

  return (
    <>
      {/* Main image */}
      <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden mb-3 bg-gray-100 cursor-zoom-in" onClick={() => setLightbox(true)}>
        <img
          src={allImages[selected]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setSelected(s => s === 0 ? allImages.length - 1 : s - 1) }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={e => { e.stopPropagation(); setSelected(s => s === allImages.length - 1 ? 0 : s + 1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {selected + 1} / {allImages.length}
            </div>
          </>
        )}
        <div className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
          🔍 Click to zoom
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ' +
                (selected === i ? 'border-yellow-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100')}
            >
              <img src={img} alt={name + ' ' + (i + 1)} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300" onClick={() => setLightbox(false)}>✕</button>
          {allImages.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setSelected(s => s === 0 ? allImages.length - 1 : s - 1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300"
              >
                ‹
              </button>
              <button
                onClick={e => { e.stopPropagation(); setSelected(s => s === allImages.length - 1 ? 0 : s + 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300"
              >
                ›
              </button>
            </>
          )}
          <img
            src={allImages[selected]}
            alt={name}
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white/60 text-sm">{selected + 1} / {allImages.length}</p>
        </div>
      )}
    </>
  )
}
