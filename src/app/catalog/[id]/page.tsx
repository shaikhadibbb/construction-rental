import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from '@/components/ui/ReviewForm'
import ReviewsList from '@/components/ui/ReviewsList'
import ImageGallery from '@/components/ui/ImageGallery'
import QuoteForm from '@/components/ui/QuoteForm'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await supabase.from('equipment').select('name, category, daily_rate').eq('id', params.id).single()
  if (!data) return { title: 'Equipment Not Found' }
  return {
    title: data.name,
    description: `Rent a ${data.name} (${data.category}) from $${data.daily_rate}/day. Available across India with fast delivery.`,
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

  const specs = equipment.specs || {}
  const images = equipment.images?.length > 0 ? equipment.images : [equipment.image_url]
  const avgRating = reviews?.length
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-[#0a1628] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link href="/catalog" className="text-gray-500 hover:text-gray-300 transition-colors">Catalog</Link>
            <span className="text-gray-600">/</span>
            <span className="text-yellow-500 font-medium capitalize">{equipment.category}</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium truncate max-w-[200px]">{equipment.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <ImageGallery images={images} name={equipment.name} />
            </div>

            {/* Title & meta */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-full capitalize">
                  {equipment.category}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  equipment.is_available ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${equipment.is_available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {equipment.is_available ? 'Available Now' : 'Unavailable'}
                </span>
                {avgRating && (
                  <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1">
                    ⭐ {avgRating} ({reviews?.length} reviews)
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-[#0a1628] mb-3 leading-tight">{equipment.name}</h1>

              <p className="text-gray-600 leading-relaxed text-base">{equipment.description}</p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  { label: 'Daily Rate', value: '$' + equipment.daily_rate, sub: 'per day' },
                  { label: 'Category', value: equipment.category, sub: 'equipment type', capitalize: true },
                  { label: 'Status', value: equipment.is_available ? 'Ready' : 'Unavailable', sub: 'current status' },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className={`font-black text-[#0a1628] text-lg ${stat.capitalize ? 'capitalize' : ''}`}>{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="font-black text-[#0a1628] text-xl">Specifications</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 capitalize font-medium mb-1">{key.replace(/_/g, ' ')}</p>
                      <p className="font-black text-[#0a1628] text-sm">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why rent this */}
            <div className="bg-[#0a1628] rounded-2xl p-6">
              <h2 className="font-black text-white text-xl mb-5">Why Rent From Us</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🔍', title: '50-Point Inspection', desc: 'Every machine is inspected before delivery.' },
                  { icon: '⚡', title: '2hr Quote Response', desc: 'We respond to every request within 2 hours.' },
                  { icon: '🚚', title: 'On-site Delivery', desc: 'Delivered directly to your construction site.' },
                  { icon: '🛠️', title: '24/7 Support', desc: 'On-call technicians for any on-site issues.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-black text-[#0a1628] text-xl">Customer Reviews</h2>
                  {avgRating && <p className="text-sm text-gray-400">{avgRating} average · {reviews?.length} reviews</p>}
                </div>
              </div>
              <ReviewsList reviews={reviews || []} />
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-[#0a1628] mb-4">Leave a Review</h3>
                <ReviewForm equipmentId={id} existingReview={null} />
              </div>
            </div>
          </div>

          {/* RIGHT — sticky quote panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Price card */}
              <div className="bg-[#0a1628] rounded-2xl p-5">
                <p className="text-gray-400 text-xs font-medium mb-1">Starting from</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-black text-white">${equipment.daily_rate}</span>
                  <span className="text-gray-400 text-sm mb-1">/day</span>
                </div>
                <div className="space-y-2">
                  {[
                    'No hidden fees',
                    'Free on-site delivery',
                    '24/7 technical support',
                    'Fully insured equipment',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote form */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                {equipment.is_available ? (
                  <QuoteForm equipmentName={equipment.name} />
                ) : (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="font-bold text-gray-900 mb-1">Currently Unavailable</p>
                    <p className="text-gray-400 text-sm mb-4">This equipment is not available right now.</p>
                    <Link href="/catalog"
                      className="block w-full bg-[#0a1628] hover:bg-[#0d1e35] text-white font-bold py-3 rounded-xl text-sm text-center transition-colors">
                      Browse Similar Equipment
                    </Link>
                  </div>
                )}
              </div>

              {/* Need help */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                <p className="font-bold text-[#0a1628] text-sm mb-1">Need help choosing?</p>
                <p className="text-gray-500 text-xs mb-3">Our experts are available Mon–Sat, 9am–6pm IST</p>
                <a href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 bg-[#0a1628] text-white font-bold py-2.5 rounded-xl text-sm transition-colors hover:bg-[#0d1e35]">
                  📞 +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}