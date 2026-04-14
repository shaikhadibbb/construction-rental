'use client'

import { useEffect, useState } from 'react'
import { subscribeToast, type ToastMessage } from '@/lib/toast'

export default function ToastViewport() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    return subscribeToast((toast) => {
      setToasts((prev) => [...prev, toast])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id))
      }, 2800)
    })
  }, [])

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map((toast) => {
        const color = toast.variant === 'error' ? '#f87171' : toast.variant === 'success' ? '#4ade80' : '#f4a261'
        return (
          <div key={toast.id} role="status" style={{ minWidth: 260, maxWidth: 340, background: '#0f0f0f', border: `1px solid ${color}55`, borderRadius: 12, padding: '12px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <p style={{ margin: 0, color, fontWeight: 700, fontSize: 13 }}>{toast.title}</p>
            {toast.description && <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{toast.description}</p>}
          </div>
        )
      })}
    </div>
  )
}
