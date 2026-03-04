import Link from 'next/link'

const STATS = [
  { value: '50+', label: 'Equipment Items', icon: '🚧' },
  { value: '200+', label: 'Happy Customers', icon: '👷' },
  { value: '5★', label: 'Average Rating', icon: '⭐' },
  { value: '24/7', label: 'Support Available', icon: '⚡' },
]

const VALUES = [
  { icon: '🔒', title: 'Trust & Safety', desc: 'All equipment is inspected, insured, and maintained to the highest safety standards before every rental.' },
  { icon: '⚡', title: 'Fast Response', desc: 'Submit a quote request and hear back within 2 hours. No paperwork, no phone tag.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'What you see is what you pay. No hidden fees, no surprise charges. Ever.' },
  { icon: '🤝', title: 'Reliable Support', desc: 'Our team is available 6 days a week to help with any questions or on-site issues.' },
]

const TEAM = [
  { name: 'Adib Azam Shaikh', role: 'Founder & CEO', initial: 'A', desc: 'Built ConstructRent to make equipment rental simple and transparent for every contractor in India.' },
  { name: 'Operations Team', role: 'Equipment & Logistics', initial: 'O', desc: 'Ensures every piece of equipment is maintained, clean, and ready for your project on time.' },
  { name: 'Support Team', role: 'Customer Success', initial: 'S', desc: 'Here to help you find the right equipment and make your rental experience seamless.' },
]

const TIMELINE = [
  { year: '2024', event: 'ConstructRent founded in Mumbai with 5 pieces of equipment and a big vision.' },
  { year: '2025', event: 'Expanded to 50+ equipment items across 6 categories, serving contractors city-wide.' },
  { year: '2026', event: 'Launched online quote platform — request equipment in minutes, not hours.' },
]

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#0a1628] relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px)'}} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm font-semibold tracking-wide">OUR STORY</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Built for <span className="text-yellow-500">Builders</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ConstructRent was born from a simple idea — renting construction equipment should be as easy as ordering food online. No middlemen, no paperwork, just the right equipment on time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-yellow-500 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-4xl font-black text-[#0a1628]">{stat.value}</p>
              <p className="text-[#0a1628]/70 font-semibold text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-3">Our Story</p>
              <h2 className="text-4xl font-black text-[#0a1628] mb-6">From Frustration to Solution</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>ConstructRent started in Mumbai in 2024 when our founder Adib noticed that small and medium contractors were spending hours calling equipment dealers, negotiating prices, and dealing with unreliable deliveries.</p>
                <p>We built a platform that puts contractors in control. Browse real equipment, see real prices, request a quote, and get back to building.</p>
                <p>Today we serve hundreds of contractors across Mumbai with a growing fleet of excavators, cranes, forklifts, compactors, and more — all available online.</p>
              </div>
              <Link href="/catalog" className="inline-flex items-center gap-2 mt-8 bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-6 py-3 rounded-xl transition-all hover:scale-105">
                Browse Our Equipment →
              </Link>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#0a1628] text-yellow-500 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {item.year}
                    </div>
                    {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-2" />}
                  </div>
                  <div className="pb-8 pt-2">
                    <p className="text-gray-600 leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-3">Our Values</p>
            <h2 className="text-4xl font-black text-[#0a1628]">What We Stand For</h2>
            <p className="text-gray-500 mt-3">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(value => (
              <div key={value.title} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all group">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-yellow-500 transition-colors">
                  {value.icon}
                </div>
                <h3 className="font-black text-[#0a1628] mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-3">The Team</p>
            <h2 className="text-4xl font-black text-[#0a1628]">People Behind ConstructRent</h2>
            <p className="text-gray-500 mt-3">Dedicated to making your rental experience seamless</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-yellow-200 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-[#0a1628] text-yellow-500 flex items-center justify-center font-black text-2xl mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-black text-[#0a1628]">{member.name}</h3>
                <p className="text-yellow-600 text-sm font-bold mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4">Get Started</p>
          <h2 className="text-4xl font-black text-white mb-4">Ready to Build Something Great?</h2>
          <p className="text-gray-400 mb-10">Join hundreds of contractors who trust ConstructRent for their equipment needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-8 py-4 rounded-xl transition-all hover:scale-105">
              Browse Equipment →
            </Link>
            <Link href="/contact" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}