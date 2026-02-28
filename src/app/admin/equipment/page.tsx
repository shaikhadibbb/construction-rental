import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ToggleAvailability from '@/components/admin/ToggleAvailability'

export default async function AdminEquipmentPage() {
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
        <Link href="/admin/equipment/new" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
          + Add Equipment
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Equipment</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Daily Rate</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {equipment?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">${item.daily_rate}/day</span>
                </td>
                <td className="px-6 py-4">
                  <ToggleAvailability id={item.id} isAvailable={item.is_available} />
                </td>
                <td className="px-6 py-4">
                  <Link href={'/admin/equipment/' + item.id + '/edit'} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
