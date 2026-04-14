/**
 * Environment variable validation.
 * Called at startup to fail fast if required variables are missing.
 */

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/** Validated environment variables */
export const env = {
  supabaseUrl: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://constructrent.in',
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'hello@constructrent.in',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210',
  callNumber: process.env.NEXT_PUBLIC_CALL_NUMBER ?? '+919876543210',
}
