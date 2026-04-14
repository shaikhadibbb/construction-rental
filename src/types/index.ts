/**
 * Shared TypeScript interfaces for ConstructRent platform.
 * Import from here instead of redeclaring locally in each file.
 */

/** Equipment item from the `equipment` table */
export interface Equipment {
  id: string
  name: string
  description: string
  category: string
  daily_rate: number
  image_url: string
  images: string[]
  is_available: boolean
  created_at: string
}

/** Booking record from the `bookings` table */
export interface Booking {
  id: string
  user_id?: string
  equipment_id?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  equipment_name?: string
  start_date: string
  end_date: string
  total_amount: number
  status: BookingStatus
  notes?: string
  created_at: string
  /** Joined relation */
  equipment?: {
    name: string
    category: string
    image_url: string
    daily_rate: number
  }
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

/** User profile from the `profiles` table */
export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: 'user' | 'admin'
  created_at: string
}

/** Review from the `reviews` table */
export interface Review {
  id: string
  user_id: string
  equipment_id: string
  rating: number
  comment: string
  created_at: string
  profiles?: { email: string } | null
}

/** Form data shape used by EquipmentForm */
export interface EquipmentFormData {
  name: string
  description: string
  category: string
  daily_rate: string
  image_url: string
  images: string[]
  is_available: boolean
}
