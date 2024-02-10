// import { createClient } from '@supabase/supabase-js'

import { createBrowserClient } from '@supabase/ssr'

import { createAuth } from '@redwoodjs/auth-supabase-web'

const supabaseClient = createBrowserClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

export const { AuthProvider, useAuth } = createAuth(supabaseClient)
