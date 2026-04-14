'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 460, textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, background: 'rgba(255,255,255,0.02)', padding: 28 }}>
        <p style={{ fontSize: 34, margin: '0 0 10px' }}>⚠️</p>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff' }}>Something went wrong</h2>
        <p style={{ margin: '10px 0 20px', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          Please try again. If the issue persists, contact support.
        </p>
        <button onClick={reset} style={{ border: 'none', borderRadius: 10, background: '#f4a261', color: '#0a0a0a', fontWeight: 700, fontSize: 14, padding: '12px 20px', cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    </div>
  )
}
