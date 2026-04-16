import { supabaseAnon as supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// List of all valid SEO slugs and their metadata for static generation
const SEO_PAGES = {
  'excavator-rental-mumbai': { equipment: 'Excavators', location: 'Mumbai', category: 'Excavator' },
  'excavator-rental-ahmedabad': { equipment: 'Excavators', location: 'Ahmedabad', category: 'Excavator' },
  'excavator-rental-gujarat': { equipment: 'Excavators', location: 'Gujarat', category: 'Excavator' },
  'crane-rental-mumbai': { equipment: 'Cranes', location: 'Mumbai', category: 'Crane' },
  'crane-rental-gujarat': { equipment: 'Cranes', location: 'Gujarat', category: 'Crane' },
  'forklift-rental-mumbai': { equipment: 'Forklifts', location: 'Mumbai', category: 'Forklift' },
  'jcb-rental-near-me': { equipment: 'JCB Backhoes', location: 'Your Area', category: 'Excavator' },
  'construction-equipment-rental-mumbai': { equipment: 'Construction Equipment', location: 'Mumbai', category: 'All' },
  'construction-equipment-rental-gujarat': { equipment: 'Construction Equipment', location: 'Gujarat', category: 'All' },
  'compactor-rental-mumbai': { equipment: 'Compactors', location: 'Mumbai', category: 'Compactor' },
}

export const revalidate = 86400 // Revalidate daily

export async function generateStaticParams() {
  return Object.keys(SEO_PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise
  const page = SEO_PAGES[params.slug as keyof typeof SEO_PAGES]
  if (!page) return { title: 'Not Found' }

  return {
    title: `${page.equipment} Rental in ${page.location} | Best Rates — ConstructRent`,
    description: `Looking for ${page.equipment.toLowerCase()} rental in ${page.location}? Get guaranteed same-day delivery, verified operators, and transparent pricing.`,
  }
}

export default async function GeoLandingPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise
  const page = SEO_PAGES[params.slug as keyof typeof SEO_PAGES]

  if (!page) notFound()

  // Fetch relevant equipment depending on the SEO page category
  let query = supabase.from('equipment').select('id, name, daily_rate, image_url, category').eq('is_available', true).limit(6)
  if (page.category !== 'All') {
    query = query.ilike('category', `%${page.category}%`)
  }
  const { data: equipmentList } = await query

  const faqs = [
    { q: `How fast can you deliver a ${page.category !== 'All' ? page.category : 'machine'} to ${page.location}?`, a: `We guarantee next-day delivery to most sites in ${page.location}. If you book before 10 AM, we can often arrange same-day delivery.` },
    { q: `Are operators included with the rental?`, a: `Yes, we can provide certified, police-verified operators with all our heavy machinery.` },
    { q: `Is fuel included in the daily rate?`, a: `The base daily rate is "dry" (without fuel). You can either provide your own diesel or opt for our Fuel Top-Up service during checkout.` },
  ]

  return (
    <div className="ui-page-shell">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 bg-[url('/grid-bg.svg')] bg-[length:40px_40px] bg-center items-center justify-center border-b border-white/5" style={{ background: '#050505' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 to-[#050505]" />
        
        <div className="relative mx-auto max-w-4xl text-center z-10">
          <p className="text-coral text-sm font-bold tracking-[0.1em] uppercase mb-4">Service Area: {page.location}</p>
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-[-0.02em]">
            Reliable {page.equipment} Rental in <span className="text-coral">{page.location}</span>
          </h1>
          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Need a {page.category !== 'All' ? page.category.toLowerCase() : 'machine'} on site fast? We offer fully-inspected, insured heavy equipment delivered directly to your job site in {page.location}.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="bg-coral hover:bg-[#ff8a6c] text-[#0a0a0a] font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,107,44,0.3)]">
              Browse Available {page.equipment}
            </Link>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-24 px-6 relative z-10" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <h2 className="font-space-grotesk text-3xl font-black text-white mb-2">Available in {page.location}</h2>
              <p className="text-white/40 text-sm">Real-time inventory from our automated dispatch system.</p>
            </div>
          </div>
          
          {equipmentList && equipmentList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentList.map(item => (
                <Link key={item.id} href={`/catalog/${item.id}`} className="block group">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    <div className="aspect-[4/3] bg-black/50 relative">
                      {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-coral font-bold uppercase tracking-widest mb-1">{item.category}</p>
                      <h3 className="font-bold text-white text-lg mb-4">{item.name}</h3>
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-sm text-white/50">From <strong className="text-white">₹{item.daily_rate.toLocaleString('en-IN')}/day</strong></span>
                        <span className="text-xs font-bold text-coral group-hover:translate-x-1 transition-transform inline-block">Rent Now →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-2xl mx-auto">
              <p className="text-3xl mb-3">🚧</p>
              <p className="font-bold text-white mb-2">Inventory Updating</p>
              <p className="text-white/40 text-sm mb-6">Contact us directly for exact availability in {page.location}.</p>
              <Link href="/contact" className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Contact Sales
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 border-y border-white/5" style={{ background: '#050505' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space-grotesk text-3xl font-black text-white">The ConstructRent Standard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Live Availability', desc: 'No more calling around. What you see on the platform is physically sitting in our yard, ready to be dispatched to your site.' },
              { icon: '🚚', title: `Direct to ${page.location}`, desc: `Our logistics network covers all major construction zones across ${page.location} with transparent delivery pricing.` },
              { icon: '🛡️', title: 'Verified Operators', desc: 'Add experienced, police-verified operators to any rental directly during the checkout flow.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-coral/10 text-coral rounded-xl flex items-center justify-center text-2xl mb-6 shadow-[0_0_15px_rgba(255,107,44,0.15)]">{item.icon}</div>
                <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <section className="py-24 px-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="font-space-grotesk text-2xl font-black text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-2 text-sm">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
    </div>
  )
}
