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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img src={equipment.image_url} alt={equipment.name} className="w-full h-full object-cover" />
        <div className={equipment.is_available ? 'absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700' : 'absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700'}>
          {equipment.is_available ? '✓ Available' : '✗ Unavailable'}
        </div>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full capitalize">
          {equipment.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">{equipment.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{equipment.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">${equipment.daily_rate}</span>
            <span className="text-sm text-gray-400">/day</span>
          </div>
          <Link href={'/catalog/' + equipment.id} className={equipment.is_available ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white' : 'px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400'}>
            {equipment.is_available ? 'Rent Now' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  )
}
