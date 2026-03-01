import Link from 'next/link'

const STATS = [
  { value: '50+', label: 'Equipment Items' },
  { value: '200+', label: 'Happy Customers' },
  { value: '5★', label: 'Average Rating' },
  { value: '24/7', label: 'Support' },
]

const VALUES = [
  { emoji: '🔒', title: 'Trust & Safety', desc: 'All equipment is inspected, insured, and maintained to the highest safety standards before every rental.' },
  { emoji: '⚡', title: 'Fast Booking', desc: 'Book any equipment in under 2 minutes. No paperwork, no phone calls, no waiting.' },
  { emoji: '💰', title: 'Transparent Pricing', desc: 'What you see is what you pay. No hidden fees, no surprise charges. Ever.' },
  { emoji: '🤝', title: 'Reliable Support', desc: 'Our team is available 6 days a week to help with any questions or issues.' },
]

const TEAM = [
  { name: 'Adib Azam Shaikh', role: 'Founder & CEO', emoji: '👨‍💼', desc: 'Built ConstructRent to make equipment rental simple for every contractor in India.' },
  { name: 'Operations Team', role: 'Equipment & Logistics', emoji: '🔧', desc: 'Ensures every piece of equipment is maintained, clean, and ready for your project.' },
  { name: 'Support Team', role: 'Customer Success', emoji: '🎧', desc: 'Here to help you find the right equipment and make your rental experience smooth.' },
]

const TIMELINE = [
  { year: '2024', event: 'ConstructRent founded in Mumbai with 5 pieces of equipment' },
  { year: '2025', event: 'Expanded to 50+ equipment items across 6 categories' },
  { year: '2026', event: 'Launched online booking platform — rent equipment in minutes' },
]

export default function AboutPage() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-5xl block mb-4">🏗️</span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for Builders
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            ConstructRent was born from a simple idea — renting construction equipment should be as easy as ordering food online. No middlemen, no paperwork, just the right equipment delivered on time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-yellow-500 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-800 font-medium text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                ConstructRent started in Mumbai in 2024 when our founder Adib noticed that small and medium contractors were spending hours calling equipment dealers, negotiating prices, and dealing with unreliable deliveries.
              </p>
              <p>
                We built a platform that puts contractors in control. Browse real equipment, see real prices, book instantly, and get back to building.
              </p>
              <p>
                Today we serve hundreds of contractors across Mumbai with a growing fleet of excavators, cranes, forklifts, compactors, and more.
              </p>
            </div>
            <Link href="/catalog" className="inline-block mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Browse Our Equipment →
            </Link>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.year.slice(2)}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-0.5 h-full bg-yellow-200 mt-1"></div>}
                </div>
                <div className="pb-6">
                  <p className="font-bold text-gray-900 text-sm">{item.year}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Stand For</h2>
            <p className="text-gray-500">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(value => (
              <div key={value.title} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl block mb-3">{value.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet the Team</h2>
            <p className="text-gray-500">The people behind ConstructRent</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <span className="text-5xl block mb-4">{member.emoji}</span>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-yellow-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to build something great?</h2>
          <p className="text-gray-400 mb-8">Join hundreds of contractors who trust ConstructRent.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl transition-colors">
              Browse Equipment →
            </Link>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
