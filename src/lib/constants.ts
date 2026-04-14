/**
 * Application-wide constants.
 * Import from here instead of hardcoding strings in components.
 */

/** WhatsApp number in international format without '+' (for wa.me links) */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210'

/** Call number with country code (for tel: links) */
export const CALL_NUMBER = process.env.NEXT_PUBLIC_CALL_NUMBER ?? '+919876543210'

/** Admin / support email */
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'hello@constructrent.in'

/** Site base URL */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://constructrent.in'

/** Pre-encoded default WhatsApp message */
export const WHATSAPP_MSG = encodeURIComponent(
  'Hi! I want to rent construction equipment. Can you help?'
)

/** Equipment categories (value used in DB, label shown in UI) */
export const CATEGORIES = [
  { value: 'excavators', label: 'Excavators', icon: '🚧' },
  { value: 'cranes', label: 'Cranes', icon: '🏗️' },
  { value: 'forklifts', label: 'Forklifts', icon: '🚜' },
  { value: 'compactors', label: 'Compactors', icon: '🛞' },
  { value: 'telehandlers', label: 'Telehandlers', icon: '🔧' },
  { value: 'compressors', label: 'Compressors', icon: '⚙️' },
] as const

export type CategoryValue = (typeof CATEGORIES)[number]['value']

/** Booking status labels & style tokens */
export const BOOKING_STATUS = {
  pending:   { label: 'Pending Review',  color: 'rgba(234,179,8,0.15)',   dot: '#eab308', pulse: true  },
  confirmed: { label: 'Confirmed',       color: 'rgba(74,222,128,0.12)',  dot: '#4ade80', pulse: false },
  cancelled: { label: 'Cancelled',       color: 'rgba(239,68,68,0.12)',   dot: '#f87171', pulse: false },
  completed: { label: 'Completed',       color: 'rgba(255,255,255,0.06)', dot: 'rgba(255,255,255,0.3)', pulse: false },
} as const
