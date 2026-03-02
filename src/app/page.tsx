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

  const CATEGORIES = [
    { name: 'Excavators', icon: '🚧', slug: 'excavators', desc: 'Hydraulic & crawler' },
    { name: 'Cranes', icon: '🏗️', slug: 'cranes', desc: 'Tower & mobile' },
    { name: 'Forklifts', icon: '🚜', slug: 'forklifts', desc: 'Electric & diesel' },
    { name: 'Compactors', icon: '🛞', slug: 'compactors', desc: 'Plate & roller' },
    { name: 'Telehandlers', icon: '🔧', slug: 'telehandlers', desc: 'Rotating & fixed' },
    { name: 'Compressors', icon: '⚙️', slug: 'compressors', desc: 'Portable & stationary' },
  ]

  const STEPS = [
    { num: '01', title: 'Browse & Select', desc: 'Search our catalog of professional-grade machines by category, specs, or availability.', icon: '🔍' },
    { num: '02', title: 'Request a Quote', desc: 'Submit your project details and rental period. Our team responds within 2 hours.', icon: '📋' },
    { num: '03', title: 'Deploy & Build', desc: 'Equipment arrives on site on your confirmed date, inspected and ready to work.', icon: '🏗️' },
  ]

  const TESTIMONIALS = [
    { name: 'Rajesh Kumar', role: 'Site Manager', company: 'Larsen & Toubro, Mumbai', text: 'Booked an excavator in under 3 minutes. Seamless process and equipment was in perfect condition.', rating: 5 },
    { name: 'Priya Sharma', role: 'Senior Contractor', company: 'Shapoorji Pallonji, Pune', text: 'Finally a platform with real prices and no negotiation games. Saved me hours every single month.', rating: 5 },
    { name: 'Amir Khan', role: 'Project Director', company: 'Gammon India, Delhi', text: 'The online dashboard makes tracking all our rentals across sites incredibly easy.', rating: 5 },
  ]

  const TRUST = [
    { value: totalEquipment + '+', label: 'Equipment Items', icon: '🚧' },
    { value: totalBookings + '+', label: 'Completed Rentals', icon: '✅' },
    { value: totalUsers + '+', label: 'Verified Contractors', icon: '👷' },
    { value: '24h', label: 'Quote Response', icon: '⚡' },
  ]

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-[#0a1628] overflow-hidden min-h-[600px] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px)'}} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-semibold tracking-wide">INDIA'S LEADING EQUIPMENT RENTAL PLATFORM</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Professional
              <span className="block text-yellow-500">Construction</span>
              <span className="block text-gray-300 text-4xl sm:text-5xl lg:text-6xl font-bold mt-1">Equipment Rental</span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
              Access 50+ professional-grade machines from verified suppliers. Request a quote in minutes — no middlemen, no paperwork, just the right equipment on time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-8 py-4 rounded-xl text-base transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/25">
                Browse Equipment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
                Talk to an Expert
              </Link>
            </div>

            {/* Mini trust bar */}
            <div className="flex flex-wrap gap-6 mt-12">
              {['ISO Certified Equipment', 'On-time Delivery Guaranteed', 'Pan-India Coverage'].map(item => (
                <div key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 5 1440 0V60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── TRUST STATS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST.map(stat => (
              <div key={stat.label} className="text-center group">
                <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:bg-yellow-500 transition-colors group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-3xl font-black text-[#0a1628]">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-yellow-600 text-sm font-bold tracking-widest uppercase mb-2">Our Fleet</p>
              <h2 className="text-4xl font-black text-[#0a1628]">Browse by Category</h2>
              <p className="text-gray-500 mt-2">Professionally maintained equipment for every project</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700">
              View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={'/catalog?category=' + cat.slug}
                className="group bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/10 transition-all hover:-translate-y-1">
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EQUIPMENT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-yellow-600 text-sm font-bold tracking-widest uppercase mb-2">Available Now</p>
              <h2 className="text-4xl font-black text-[#0a1628]">Featured Equipment</h2>
              <p className="text-gray-500 mt-2">Ready to deploy to your site</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700">
              View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment?.map(item => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-yellow-500 text-sm font-bold tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-white">How It Works</h2>
            <p className="text-gray-400 mt-3 text-lg">From request to deployment in 3 steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0" />

            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-3xl mx-auto">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-500 text-[#0a1628] text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs font-black text-yellow-500 tracking-widest mb-2">STEP {step.num}</p>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-yellow-600 text-sm font-bold tracking-widest uppercase mb-3">Social Proof</p>
            <h2 className="text-4xl font-black text-[#0a1628]">Trusted by India's Best</h2>
            <p className="text-gray-500 mt-2">Contractors from leading firms rely on ConstructRent</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0a1628] text-yellow-500 flex items-center justify-center font-black text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-600 text-sm font-bold tracking-widest uppercase mb-3">Why ConstructRent</p>
              <h2 className="text-4xl font-black text-[#0a1628] mb-6">Built for Serious Contractors</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                We understand that downtime costs money. That's why every machine in our fleet is regularly serviced, inspected, and ready to deploy on your timeline.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Verified Equipment', desc: 'Every machine undergoes 50-point inspection before rental.' },
                  { title: 'Transparent Pricing', desc: 'No hidden fees. The price you see is the price you pay.' },
                  { title: 'Dedicated Support', desc: '24/7 on-call support for any on-site equipment issues.' },
                  { title: 'Pan-India Delivery', desc: 'We deliver to your site anywhere across India.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '50+', label: 'Machine Types', color: 'bg-[#0a1628] text-white' },
                { num: '99%', label: 'On-time Rate', color: 'bg-yellow-500 text-[#0a1628]' },
                { num: '2hr', label: 'Quote Response', color: 'bg-yellow-500 text-[#0a1628]' },
                { num: '5★', label: 'Average Rating', color: 'bg-[#0a1628] text-white' },
              ].map(card => (
                <div key={card.label} className={`${card.color} rounded-2xl p-8 text-center`}>
                  <p className="text-4xl font-black mb-1">{card.num}</p>
                  <p className="text-sm font-semibold opacity-75">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-yellow-500 text-sm font-bold tracking-widest uppercase mb-4">Start Today</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Ready to Build Something Great?</h2>
          <p className="text-gray-400 text-lg mb-10">Join hundreds of contractors who trust ConstructRent for their equipment needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-10 py-4 rounded-xl text-base transition-all hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30">
              Browse Equipment →
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-10 py-4 rounded-xl text-base transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#06101f] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-yellow-500 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                </div>
                <span className="font-black text-white">Construct<span className="text-yellow-500">Rent</span></span>
              </Link>
              <p className="text-sm leading-relaxed">India's most trusted construction equipment rental platform for professional contractors.</p>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-4">Equipment</p>
              <div className="space-y-2 text-sm">
                {['Excavators', 'Cranes', 'Forklifts', 'Compactors', 'Telehandlers'].map(item => (
                  <Link key={item} href={'/catalog?category=' + item.toLowerCase()} className="block hover:text-yellow-500 transition-colors">{item}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-4">Company</p>
              <div className="space-y-2 text-sm">
                {[['About Us', '/about'], ['Careers', '/careers'], ['Contact', '/contact'], ['Blog', '/blog']].map(([label, href]) => (
                  <Link key={label} href={href} className="block hover:text-yellow-500 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-4">Contact</p>
              <div className="space-y-3 text-sm">
                <p>📍 Mumbai, Maharashtra</p>
                <p>📞 +91 98765 43210</p>
                <p>✉️ adibazam123@gmail.com</p>
                <p>⏰ Mon–Sat, 9am–6pm IST</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 ConstructRent. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}