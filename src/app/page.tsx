import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function HomePage() {
  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, category, daily_rate, image_url, is_available')
    .limit(3)
    .order('created_at', { ascending: true })

  const { count: equipmentCount } = await supabase
    .from('equipment')
    .select('*', { count: 'exact', head: true })

  const { count: bookingCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { value: (equipmentCount || 0) + '+', label: 'Equipment Items' },
    { value: (bookingCount || 0) + '+', label: 'Bookings Made' },
    { value: '24/7', label: 'Support' },
    { value: '5★', label: 'Rated Service' },
  ]

  const categories = [
    { name: 'Excavators', emoji: '🚜', desc: 'Heavy excavation & demolition' },
    { name: 'Cranes',     emoji: '🏗️', desc: 'Heavy lifting & steel erection' },
    { name: 'Forklifts',  emoji: '🔧', desc: 'Material handling & warehousing' },
    { name: 'Compactors', emoji: '🛞', desc: 'Soil & asphalt compaction' },
  ]

  return (
    <div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 text-yellow-400 text-sm font-medium mb-6">
            🏗️ Professional Construction Equipment
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Rent the Right Equipment
            <span className="text-yellow-400 block mt-2">for Every Project</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Access top-quality construction equipment at competitive daily rates.
            Book online in minutes, pick up and build.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              Browse Equipment →
            </Link>
            <Link href="/register" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-yellow-500 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-800 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-500">Find exactly what your project needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={'/catalog?category=' + cat.name.toLowerCase()}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-yellow-400 hover:shadow-md transition-all group"
              >
                <span className="text-4xl block mb-3">{cat.emoji}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-yellow-600">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EQUIPMENT */}
      {equipment && equipment.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Equipment</h2>
                <p className="text-gray-500">Most popular rentals this week</p>
              </div>
              <Link href="/catalog" className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <Link key={item.id} href={'/catalog/' + item.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full capitalize">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2">{item.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-gray-900">${item.daily_rate}<span className="text-sm text-gray-400 font-normal">/day</span></span>
                      <span className="text-sm text-yellow-600 font-medium group-hover:underline">Rent Now →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500 mb-14">Rent equipment in 3 simple steps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Choose', desc: 'Search our catalog of equipment by category or name', emoji: '🔍' },
              { step: '02', title: 'Book Online', desc: 'Select your dates, see the total price instantly, confirm with one click', emoji: '📅' },
              { step: '03', title: 'Get to Work', desc: 'Pick up your equipment and get your project moving', emoji: '🚀' },
            ].map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-8 border border-gray-200 relative">
                <span className="text-5xl block mb-4">{step.emoji}</span>
                <span className="absolute top-4 right-4 text-4xl font-bold text-gray-100">{step.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join contractors who trust ConstructRent for their equipment needs.</p>
          <Link href="/register" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-10 py-4 rounded-xl text-lg transition-colors inline-block">
            Create Free Account →
          </Link>
        </div>
      </section>

    </div>
  )
}
