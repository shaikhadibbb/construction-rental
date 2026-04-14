import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from './env'

const { supabaseUrl, supabaseAnonKey } = env

/**
 * Server-side Supabase client factory.
 * Uses cookies to handle authentication sessions in Server Components,
 * Server Actions, and API routes.
 */
export async function createActionClient() {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The setAll method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })
}
