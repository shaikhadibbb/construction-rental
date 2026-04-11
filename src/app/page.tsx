import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import HomepageClient from '@/components/ui/HomepageClient'

export default async function HomePage() {
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('is_available', true)
    .limit(6)

  const { count: totalEquipment } = await supabase
    .from('equipment')
    .select('*', { count: 'exact', head: true })

  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  return <HomepageClient equipment={equipment || []} totalEquipment={totalEquipment || 0} totalBookings={totalBookings || 0} />
}