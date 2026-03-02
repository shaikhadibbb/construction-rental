'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function deleteEquipment(id: string) {
  const { error } = await supabase.from('equipment').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/equipment')
}

export async function saveEquipment(id: string, data: {
  name: string
  description: string
  category: string
  daily_rate: number
  image_url: string
  images: string[]
  is_available: boolean
}) {
  const { error } = await supabase.from('equipment').update(data).eq('id', id)
  if (error) throw error
  revalidatePath('/admin/equipment')
}