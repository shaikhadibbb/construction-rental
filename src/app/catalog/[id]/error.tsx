'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function EquipmentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('Equipment detail error:', error)
  }, [error])

  return (
    <div className="ui-page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', background: 'var(--surface-0)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '40px', maxWidth: '400px' }}>
        <div style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444', fontSize: 24 }}>
          ⚠️
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Unable to load equipment</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
          We encountered an error while loading the details for this equipment. It might have been removed or there is a database issue.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Try Again
          </button>
          <Link
            href="/catalog"
            style={{ padding: '12px 20px', background: 'var(--accent)', color: '#000', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  )
}
