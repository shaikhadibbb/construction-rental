export default function EquipmentDetailLoading() {
  return (
    <div className="ui-page-shell" style={{ animation: 'pulse 1.5s infinite ease-in-out' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border-subtle)', height: 50 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* LEFT — Media & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 24, height: 600 }} />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 24, height: 300 }} />
          </div>

          {/* RIGHT — Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 24, height: 350 }} />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 24, height: 200 }} />
          </div>

        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
