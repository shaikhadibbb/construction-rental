import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #ece9e4',
      background: '#faf9f7',
      padding: '28px 24px',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 15, color: '#1a1a1a', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          ConstructRent
        </Link>
        <a href="mailto:hello@constructrent.in"
          style={{ fontSize: 14, color: '#777', textDecoration: 'none' }}>
          hello@constructrent.in
        </a>
        <p style={{ fontSize: 13, color: '#bbb', margin: 0 }}>© 2026</p>
      </div>
    </footer>
  )
}