'use server'

import { revalidatePath } from 'next/cache'
import { createActionClient } from '@/lib/supabase-server'

async function assertAdmin() {
  const supabase = await createActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_admin')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.role === 'admin' || profile?.is_admin === true
  if (!isAdmin) throw new Error('Not authorized')
  return supabase
}

export async function deleteEquipment(id: string) {
  const supabase = await assertAdmin()
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
  const supabase = await assertAdmin()
  const { error } = await supabase.from('equipment').update(data).eq('id', id)
  if (error) throw error
  
  revalidatePath('/admin/equipment')
  revalidatePath(`/catalog/${id}`)
  revalidatePath('/catalog')
  revalidatePath('/')
}