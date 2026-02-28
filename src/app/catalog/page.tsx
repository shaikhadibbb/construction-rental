import { supabase } from '@/lib/supabase'
import EquipmentCard from '@/components/ui/EquipmentCard'

const CATEGORIES = ['All', 'Excavators', 'Cranes', 'Forklifts', 'Compactors', 'Telehandlers', 'Compressors']

type SearchParams = Promise<{ category?: string }>

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const category = params.category?.toLowerCase()

  let query = supabase.from('equipment').select('*').order('created_at', { ascending: false })
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  const { data: equipment } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Equipment Catalog</h1>
        <p className="text-gray-500 text-lg">{equipment?.length || 0} pieces of equipment available for rent</p>
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => {
          const isActive = (!category && cat === 'All') || category === cat.toLowerCase()
          const href = cat === 'All' ? '/catalog' : '/catalog?category=' + cat.toLowerCase()
          return (
            <a key={cat} href={href} className={isActive ? 'px-4 py-2 rounded-full text-sm font-medium bg-yellow-500 text-white' : 'px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-yellow-400'}>
              {cat}
            </a>
          )
        })}
      </div>
      {equipment && equipment.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🏗️</p>
          <p className="text-xl font-medium">No equipment found</p>
        </div>
      )}
    </div>
  )
}
