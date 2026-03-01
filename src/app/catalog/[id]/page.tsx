import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BookingForm from '@/components/ui/BookingForm'
import ReviewForm from '@/components/ui/ReviewForm'
import ReviewsList from '@/components/ui/ReviewsList'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/catalog" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium mb-6 inline-block">
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2">
          <img src={equipment.image_url} alt={equipment.name} className="w-full h-80 object-cover rounded-2xl mb-6" />

          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full capitalize">
              {equipment.category}
            </span>
            <span className={'text-sm font-medium px-3 py-1 rounded-full ' + (equipment.is_available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
              {equipment.is_available ? '✓ Available' : '✗ Unavailable'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{equipment.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{equipment.description}</p>

          {Object.keys(specs).length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-xl p-3 border border-gray-200">
                    <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            <ReviewsList reviews={reviews || []} />
            <div className="mt-8">
              <ReviewForm equipmentId={id} existingReview={null} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">${equipment.daily_rate}</span>
              <span className="text-gray-400 text-sm">/day</span>
            </div>
            {equipment.is_available ? (
              <BookingForm equipment={{ id: equipment.id, name: equipment.name, daily_rate: equipment.daily_rate }} />
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-600 font-medium">Currently Unavailable</p>
                <p className="text-red-400 text-sm mt-1">Check back soon</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
