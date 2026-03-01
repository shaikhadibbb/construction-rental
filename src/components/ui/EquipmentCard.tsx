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
    <Link href={'/catalog/' + equipment.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-yellow-200 transition-all duration-200 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={equipment.image_url}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={
          'absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ' +
          (equipment.is_available ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
        }>
          {equipment.is_available ? '✓ Available' : '✗ Unavailable'}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full capitalize w-fit mb-2">
          {equipment.category}
        </span>
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-yellow-600 transition-colors">
          {equipment.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {equipment.description}
        </p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">${equipment.daily_rate}</span>
            <span className="text-gray-400 text-sm">/day</span>
          </div>
          <span className="text-sm font-semibold text-yellow-600 group-hover:text-yellow-700">
            Rent Now →
          </span>
        </div>
      </div>
    </Link>
  )
}
