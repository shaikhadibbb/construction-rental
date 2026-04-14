import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const { supabaseUrl, supabaseAnonKey } = env

/**
 * Browser/client-side Supabase client.
 * Safe to import in 'use client' components.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

/**
 * Standard Supabase client using the anon key.
 * Used for basic queries where session context is not required.
 */
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)