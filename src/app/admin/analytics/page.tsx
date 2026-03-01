import { supabase } from '@/lib/supabase'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

export default async function AnalyticsPage() {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, equipment(name, category)')
    .order('created_at', { ascending: true })

  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, category, daily_rate, is_available')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
      <AnalyticsCharts bookings={bookings || []} equipment={equipment || []} />
    </div>
  )
}
