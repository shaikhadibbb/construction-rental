function requiredValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const publicEnv = {
  // Use direct property access so Next/Turbopack can statically inline NEXT_PUBLIC_* values.
  supabaseUrl: requiredValue(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: requiredValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://constructrent.in',
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'hello@constructrent.in',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210',
  callNumber: process.env.NEXT_PUBLIC_CALL_NUMBER ?? '+919876543210',
}

export function getServerEnv() {
  return {
    resendApiKey: requiredValue(process.env.RESEND_API_KEY, 'RESEND_API_KEY'),
    resendFromEmail: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
  }
}
