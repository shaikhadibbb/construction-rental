'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ADMIN_EMAIL } from '@/lib/constants'

export default function Footer() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--background-elevated)', padding: '36px 0 46px', marginTop: 64 }}>
      <div className="ui-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <Link href="/" className="brand-logo" style={{ fontSize: 16 }}>
          <span className="brand-logo-mark" aria-hidden="true" />
          Construct<span className="brand-logo-accent">Rent</span>
        </Link>
        <a href={`mailto:${ADMIN_EMAIL}`} style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>
          {ADMIN_EMAIL}
        </a>
        <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>© 2026 ConstructRent</p>
      </div>
    </footer>
  )
}