import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import BookingForm from '@/components/ui/BookingForm'

type Props = { params: Promise<{ id: string }> }

export default async function EquipmentDetailPage({ params }: Props) {
  const { id } = await params

  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single()

  if (!equipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Equipment not found</h1>
        <Link href="/catalog" className="text-yellow-600 hover:underline">Back to catalog</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <Link href="/catalog" className="text-sm text-gray-500 hover:text-yellow-600 mb-6 inline-flex items-center gap-1">
        ← Back to catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">

        <div>
          <div className="rounded-2xl overflow-hidden h-80 bg-gray-100">
            <img src={equipment.image_url} alt={equipment.name} className="w-full h-full object-cover" />
          </div>

          <div className="mt-6">
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full capitalize">
              {equipment.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">{equipment.name}</h1>
            <p className="text-gray-600 leading-relaxed">{equipment.description}</p>

            {equipment.specs && Object.keys(equipment.specs).length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h2>
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3">
                  {Object.entries(equipment.specs).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-gray-900">${equipment.daily_rate}</span>
              <span className="text-gray-400">/day</span>
            </div>

            <div className={equipment.is_available ? 'flex items-center gap-2 mb-6 text-green-600' : 'flex items-center gap-2 mb-6 text-red-500'}>
              <div className={equipment.is_available ? 'w-2 h-2 rounded-full bg-green-500' : 'w-2 h-2 rounded-full bg-red-500'}></div>
              <span className="text-sm font-medium">{equipment.is_available ? 'Available for rent' : 'Currently unavailable'}</span>
            </div>

            {equipment.is_available ? (
              <BookingForm equipment={equipment} />
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm">
                This equipment is currently unavailable. Check back soon.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
