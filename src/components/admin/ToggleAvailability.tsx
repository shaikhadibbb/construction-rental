'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ToggleAvailability({ id, isAvailable }: { id: string, isAvailable: boolean }) {
  const [available, setAvailable] = useState(isAvailable)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('equipment')
      .update({ is_available: !available })
      .eq('id', id)
    if (!error) setAvailable(!available)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={available
        ? 'px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200'
        : 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200'
      }
    >
      {loading ? '...' : available ? '✓ Available' : '✗ Unavailable'}
    </button>
  )
}
