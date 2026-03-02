import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EquipmentCard from '@/components/ui/EquipmentCard'

export default async function HomePage() {
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('is_available', true)
    .limit(3)

  const { count: totalEquipment } = await supabase
    .from('equipment')
    .select('*', { count: 'exact', head: true })

  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const STEPS = [
    { step: '01', title: 'Browse Equipment', desc: 'Search our catalog of 50+ machines by category, price, or availability.', emoji: '🔍' },
    { step: '02', title: 'Book Instantly', desc: 'Select your dates, confirm your booking — no paperwork, no phone calls.', emoji: '📅' },
    { step: '03', title: 'Start Building', desc: 'Equipment is ready on your start date. Get back to what matters.', emoji: '🏗️' },
  ]

  const TESTIMONIALS = [
    { name: 'Rajesh Kumar', role: 'Site Manager, Mumbai', text: 'Booked an excavator in under 3 minutes. The process was seamless and the equipment was in perfect condition.', rating: 5 },
    { name: 'Priya Sharma', role: 'Contractor, Pune', text: 'Finally a platform where I can see real prices without negotiating. Saved me hours every month.', rating: 5 },
    { name: 'Amir Khan', role: 'Project Lead, Delhi', text: 'The online dashboard makes tracking all our rentals easy. Highly recommend for any construction team.', rating: 5 },
  ]

  const CATEGORIES = [
    { name: 'Excavators', emoji: '🚧', slug: 'excavators' },
    { name: 'Cranes', emoji: '🏗️', slug: 'cranes' },
    { name: 'Forklifts', emoji: '🚜', slug: 'forklifts' },
    { name: 'Compactors', emoji: '🛞', slug: 'compactors' },
    { name: 'Telehandlers', emoji: '🔧', slug: 'telehandlers' },
    { name: 'Compressors', emoji: '⚙️', slug: 'compressors' },
  ]

  return (
    <div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-block bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🏗️ India's Fastest Equipment Rental
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Rent Construction
              <span className="text-yellow-500 block">Equipment Online</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Browse 50+ machines, book in minutes, and get back to building. No middlemen, no paperwork, just the right equipment on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors text-center">
                Browse Equipment →
              </Link>
              <Link href="/register" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors text-center">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-yellow-500 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { value: totalEquipment + '+', label: 'Equipment Items' },
            { value: totalBookings + '+', label: 'Bookings Made' },
            { value: totalUsers + '+', label: 'Happy Customers' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-800 text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-500">Find exactly what your project needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={'/catalog?category=' + cat.slug}
                className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-yellow-400 hover:shadow-md transition-all group"
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured equipment */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Equipment</h2>
              <p className="text-gray-500">Available now and ready to rent</p>
            </div>
            <Link href="/catalog" className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment?.map(item => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/catalog" className="text-yellow-600 font-semibold">View all equipment →</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500">Rent equipment in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-2/3 w-full h-0.5 bg-yellow-200 -z-10"></div>
                )}
                <div className="w-16 h-16 rounded-2xl bg-yellow-500 text-white flex items-center justify-center text-2xl mx-auto mb-4">
                  {step.emoji}
                </div>
                <span className="text-xs font-bold text-yellow-500 tracking-widest">STEP {step.step}</span>
                <h3 className="font-bold text-gray-900 text-lg mt-1 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Contractors Say</h2>
            <p className="text-gray-500">Trusted by builders across India</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="text-yellow-500 text-lg mb-3">{'⭐'.repeat(t.rating)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to start your project?</h2>
          <p className="text-gray-400 text-lg mb-8">Join hundreds of contractors renting smarter with ConstructRent.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              Get Started Free →
            </Link>
            <Link href="/about" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
