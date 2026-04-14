import { supabaseAnon } from '@/lib/supabase'
import HomepageClient from '@/components/ui/HomepageClient'

// ISR: revalidate every 5 minutes so fresh equipment shows without a full redeploy
export const revalidate = 300

export default async function HomePage() {
  const [equipmentResult, totalEquipResult, totalBookingsResult] = await Promise.all([
    supabaseAnon
      .from('equipment')
      .select('id, name, category, daily_rate, image_url, is_available')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabaseAnon
      .from('equipment')
      .select('*', { count: 'exact', head: true }),
    supabaseAnon
      .from('bookings')
      .select('*', { count: 'exact', head: true }),
  ])

  return (
    <HomepageClient
      equipment={equipmentResult.data || []}
      totalEquipment={totalEquipResult.count || 0}
      totalBookings={totalBookingsResult.count || 0}
    />
  )
}