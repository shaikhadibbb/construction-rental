'use server'

import { revalidatePath } from 'next/cache'
import { createActionClient } from '@/lib/supabase-server'

export async function deleteEquipment(id: string) {
  const supabase = await createActionClient()
  const { error } = await supabase.from('equipment').delete().eq('id', id)
  if (error) throw error
  
  revalidatePath('/admin/equipment')
  revalidatePath('/catalog')
  revalidatePath('/')
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
  const supabase = await createActionClient()
  const { error } = await supabase.from('equipment').update(data).eq('id', id)
  if (error) throw error
  
  revalidatePath('/admin/equipment')
  revalidatePath(`/catalog/${id}`)
  revalidatePath('/catalog')
  revalidatePath('/')
}