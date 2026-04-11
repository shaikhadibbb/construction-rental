import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EquipmentCard from '@/components/ui/EquipmentCard'
import ContactFormSection from '@/components/ui/ContactFormSection'

export default async function HomePage() {
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('is_available', true)
    .limit(6)

  return (
    <div style={{ background: '#faf9f7', color: '#1a1a1a', fontFamily: 'inherit' }}>

      {/* HERO */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '100px 24px 80px' }}>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20, letterSpacing: '0.05em' }}>
          Construction Equipment Rental · India
        </p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24 }}>
          Your Equipment.<br />Delivered.
        </h1>
        <p style={{ fontSize: 18, color: '#555', lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
          Upload your project specs. Get matched with verified equipment in under 2 hours — no phone calls, no haggling, no delays.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#equipment"
            style={{ background: '#f4a261', color: '#fff', fontWeight: 700, padding: '13px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>
            Browse Equipment
          </a>
          <Link href="/contact"
            style={{ background: 'transparent', color: '#1a1a1a', fontWeight: 600, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15, border: '1.5px solid #ddd' }}>
            Get a Quote
          </Link>
        </div>
      </section>

      <div style={{ borderTop: '1px solid #ece9e4', maxWidth: 720, margin: '0 auto' }} />

      {/* PROBLEM */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 48, letterSpacing: '-0.02em' }}>
          Equipment rental is broken.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {[
            { label: 'The Phone Tag', desc: 'Call 5 suppliers. Leave 3 voicemails. Wait 2 days.' },
            { label: 'The Hidden Costs', desc: 'Quote says ₹50K. Actual bill: ₹63K.' },
            { label: 'The Downtime', desc: 'Equipment breaks. No backup. Project delayed.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <span style={{ color: '#f4a261', fontWeight: 800, fontSize: 14, minWidth: 20, paddingTop: 2 }}>✕</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: '#777', fontSize: 15, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: '1px solid #ece9e4', maxWidth: 720, margin: '0 auto' }} />

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Three steps. One delivery. Zero friction.
        </h2>
        <p style={{ color: '#777', fontSize: 15, marginBottom: 52 }}>We handle the complexity so you can focus on building.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {[
            { num: '01', title: 'Browse', desc: 'Search by equipment type, location, and availability. Every machine is listed with real specs and real pricing.' },
            { num: '02', title: 'Book', desc: 'Instant quotes. No negotiation. One-click confirm. Our team responds within 2 hours.' },
            { num: '03', title: 'Build', desc: 'Equipment arrives inspected, on time, and ready to work. Operator included on request.' },
          ].map(step => (
            <div key={step.num} style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#ccc', minWidth: 28, paddingTop: 4, letterSpacing: '0.05em' }}>{step.num}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{step.title}</p>
                <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: '1px solid #ece9e4', maxWidth: 720, margin: '0 auto' }} />

      {/* EQUIPMENT */}
      {equipment && equipment.length > 0 && (
        <>
          <section id="equipment" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Available now.
            </h2>
            <p style={{ color: '#777', fontSize: 15, marginBottom: 48 }}>All equipment is inspected before delivery.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {equipment.map(item => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <Link href="/catalog"
                style={{ color: '#f4a261', fontWeight: 700, fontSize: 15, textDecoration: 'none', borderBottom: '1.5px solid #f4a261', paddingBottom: 2 }}>
                View all equipment →
              </Link>
            </div>
          </section>
          <div style={{ borderTop: '1px solid #ece9e4', maxWidth: 720, margin: '0 auto' }} />
        </>
      )}

      {/* PRICING */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Simple, transparent pricing.
        </h2>
        <p style={{ color: '#777', fontSize: 15, marginBottom: 40 }}>No subscriptions. No hidden fees.</p>
        <div style={{ border: '1px solid #ece9e4', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ece9e4', background: '#f5f3f0' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '0.06em' }}>EQUIPMENT</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '0.06em' }}>DAILY</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '0.06em' }}>WEEKLY</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Excavator (20T)', daily: '₹8,000', weekly: '₹45,000' },
                { name: 'Crane (50T)', daily: '₹15,000', weekly: '₹80,000' },
                { name: 'Bulldozer', daily: '₹12,000', weekly: '₹65,000' },
                { name: 'Forklift', daily: '₹5,000', weekly: '₹28,000' },
                { name: 'Compactor', daily: '₹4,000', weekly: '₹22,000' },
              ].map((row, i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid #ece9e4' : 'none' }}>
                  <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: '16px 20px', fontSize: 15, textAlign: 'right', color: '#555' }}>{row.daily}</td>
                  <td style={{ padding: '16px 20px', fontSize: 15, textAlign: 'right', color: '#555' }}>{row.weekly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: '#bbb', marginTop: 14 }}>
          Transport and operator included. Custom pricing for 30+ day rentals.
        </p>
        <div style={{ marginTop: 32 }}>
          <Link href="/catalog"
            style={{ background: '#f4a261', color: '#fff', fontWeight: 700, padding: '13px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15, display: 'inline-block' }}>
            Get an exact quote →
          </Link>
        </div>
      </section>

      <div style={{ borderTop: '1px solid #ece9e4', maxWidth: 720, margin: '0 auto' }} />

      {/* FOUNDER NOTE */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <blockquote style={{ margin: 0 }}>
          <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', lineHeight: 1.8, color: '#333', fontStyle: 'italic', fontWeight: 400, marginBottom: 28 }}>
            "I watched contractors waste 20+ hours a month chasing equipment. So I built a platform to do it in 2 hours."
          </p>
          <footer>
            <p style={{ fontWeight: 700, fontSize: 15 }}>Adib Azam Shaikh</p>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 3 }}>Founder, ConstructRent</p>
          </footer>
        </blockquote>
      </section>

      <div style={{ borderTop: '1px solid #ece9e4', maxWidth: 720, margin: '0 auto' }} />

      {/* CONTACT */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Need something specific?
        </h2>
        <p style={{ color: '#777', fontSize: 15, marginBottom: 36 }}>Tell us what you need and we will get back to you within 2 hours.</p>
        <ContactFormSection />
      </section>

    </div>
  )
}