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
    <Link href={'/catalog/' + equipment.id}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {equipment.image_url ? (
          <img src={equipment.image_url} alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-5xl">🚧</div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
          equipment.is_available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${equipment.is_available ? 'bg-white animate-pulse' : 'bg-white'}`} />
          {equipment.is_available ? 'Available' : 'Unavailable'}
        </span>

        {/* Daily rate badge */}
        <div className="absolute bottom-3 right-3 bg-yellow-500 text-[#0a1628] font-black text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          ${equipment.daily_rate}/day
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full capitalize w-fit mb-3">
          {equipment.category}
        </span>

        <h3 className="font-black text-[#0a1628] text-base mb-2 group-hover:text-yellow-600 transition-colors leading-snug">
          {equipment.name}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {equipment.description || 'Professional-grade equipment available for rental.'}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-base font-black text-[#0a1628]">${equipment.daily_rate}<span className="text-xs font-medium text-gray-400">/day</span></p>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-yellow-600 group-hover:text-yellow-700 group-hover:gap-2 transition-all">
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}