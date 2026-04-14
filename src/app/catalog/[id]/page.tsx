import { supabaseAnon as supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from '@/components/ui/ReviewForm'
import ReviewsList from '@/components/ui/ReviewsList'
import ImageGallery from '@/components/ui/ImageGallery'
import QuoteForm from '@/components/ui/QuoteForm'
import { CALL_NUMBER } from '@/lib/constants'
import type { Review } from '@/types'

export const revalidate = 300

/**
 * Equipment Detail Page - Dynamic Route ([id])
 * Server component that fetches data and SEO metadata.
 */
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await supabase.from('equipment').select('name, category, daily_rate').eq('id', params.id).single()
  if (!data) return { title: 'Equipment Not Found' }
  return {
    title: `${data.name} Rental — ConstructRent`,
    description: `Rent a ${data.name} (${data.category}) from ₹${data.daily_rate}/day. Professional-grade construction equipment available across India.`,
  }
}

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single()

  if (!equipment) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(email)')
    .eq('equipment_id', id)
    .order('created_at', { ascending: false })

  const typedReviews = (reviews as Review[]) || []
  const specs = (equipment.specs as Record<string, string | number>) || {}
  const images = (equipment.images?.length > 0 ? equipment.images : [equipment.image_url]).filter(Boolean)
  
  const avgRating = typedReviews.length
    ? (typedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / typedReviews.length).toFixed(1)
    : null

  const surfaceStyle: React.CSSProperties = { background: 'var(--surface-0)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '24px', boxShadow: 'var(--shadow-soft)' }

  return (
    <div className="ui-page-shell">

      {/* Breadcrumb Bar */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/catalog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Catalog</Link>
            <span>/</span>
            <span style={{ color: '#f4a261', textTransform: 'capitalize', fontWeight: 600 }}>{equipment.category}</span>
            <span className="cr-hide-mobile">/</span>
            <span className="cr-hide-mobile" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{equipment.name}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>

          {/* LEFT — Media & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Main Surface: Image + Header */}
            <div style={{ ...surfaceStyle, padding: 0, overflow: 'hidden' }}>
              <ImageGallery images={images} name={equipment.name} />
              
              <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#f4a261', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {equipment.category}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: equipment.is_available ? '#4ade80' : '#ef4444', background: equipment.is_available ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: '1px solid', borderColor: equipment.is_available ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)', padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', boxShadow: equipment.is_available ? '0 0 8px currentColor' : 'none' }} />
                    {equipment.is_available ? 'Available Now' : 'Booked'}
                  </span>
                  {avgRating && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: 100 }}>
                      ⭐ {avgRating} ({typedReviews.length})
                    </span>
                  )}
                </div>

                <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{equipment.name}</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 24 }}>{equipment.description}</p>

                {/* KPI stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Daily Rate</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>₹{equipment.daily_rate.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Location</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Pan India</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Support</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div style={surfaceStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 18 }}>⚙️</span>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Technical Specs</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 4 }}>{key.replace(/_/g, ' ')}</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div style={surfaceStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Customer Feedback</h2>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{typedReviews.length} verified reviews</p>
                </div>
                {avgRating && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 24, fontWeight: 900, color: '#f4a261' }}>{avgRating}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', fontWeight: 800 }}>Average</p>
                  </div>
                )}
              </div>
              
              <ReviewsList reviews={typedReviews} />
              
              <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <ReviewForm equipmentId={equipment.id} existingReview={null} />
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 100 }}>
            
            {/* Action Card */}
            <div style={{ ...surfaceStyle, background: 'linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(5,5,5,1) 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '28px' }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Rental Price</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>₹{equipment.daily_rate.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>/ per day</span>
                </div>
              </div>

              {equipment.is_available ? (
                <QuoteForm equipmentName={equipment.name} />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ef4444' }}>✕</div>
                  <p style={{ fontWeight: 800, color: '#fff', fontSize: 15, marginBottom: 8 }}>Currently Out on Rent</p>
                  <Link href="/catalog" style={{ display: 'block', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Browse alternatives</Link>
                </div>
              )}
            </div>

            {/* Why Us Widget */}
            <div style={{ ...surfaceStyle, background: '#f4a261', color: '#0a0a0a' }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, marginBottom: 16 }}>ConstructRent Promise</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '🛡️', text: '50-Point Inspection' },
                  { icon: '🚚', text: 'Site Delivery within 24h' },
                  { icon: '🔧', text: 'On-site Mechanic Support' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 700 }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Widget */}
            <a href={`tel:${CALL_NUMBER}`} style={{ ...surfaceStyle, background: 'rgba(255,255,255,0.04)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 24 }}>📞</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Talk to an Expert</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{CALL_NUMBER}</p>
              </div>
            </a>
          </div>

        </div>
      </div>
      
      <style>{`
        @media (max-width: 640px) { .cr-hide-mobile { display: none; } }
      `}</style>
    </div>
  )
}