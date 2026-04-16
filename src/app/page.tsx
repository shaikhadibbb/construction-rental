import HomepageClient from '@/components/ui/HomepageClient'

export default function Page() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Construct Rent',
    areaServed: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'],
    telephone: '+91-99999-99999',
    priceRange: '₹₹',
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'JCB 3DX Super Excavator Rental',
    brand: 'JCB',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '2500',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <HomepageClient />
    </>
  )
}