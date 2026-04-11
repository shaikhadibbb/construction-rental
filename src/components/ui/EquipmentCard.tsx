import Link from 'next/link'

type Equipment = {
  id: string
  name: string
  description: string
  category: string
  daily_rate: number
  image_url: string
  is_available: boolean
}

export default function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <Link href={'/catalog/' + equipment.id} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)', transition: 'all 0.25s',
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
      }}
        onMouseOver={e => {
          e.currentTarget.style.border = '1px solid rgba(244,162,97,0.25)'
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        }}
        onMouseOut={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        }}>

        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#111', overflow: 'hidden' }}>
          {equipment.image_url ? (
            <img src={equipment.image_url} alt={equipment.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚧</div>
          )}
          <span style={{
            position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 5,
            background: equipment.is_available ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${equipment.is_available ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: equipment.is_available ? '#4ade80' : '#f87171',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: equipment.is_available ? '#4ade80' : '#f87171', display: 'inline-block' }} />
            {equipment.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, color: '#f4a261', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8, display: 'block' }}>
            {equipment.category}
          </span>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {equipment.name}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, flex: 1, marginBottom: 16, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
            {equipment.description || 'Professional-grade equipment available for rental.'}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 2 }}>Starting from</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                ₹{equipment.daily_rate.toLocaleString('en-IN')}
                <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>/day</span>
              </p>
            </div>
            <span style={{ fontSize: 13, color: '#f4a261', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}