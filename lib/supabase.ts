import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export type Fest = {
  id: string
  name: string
  type: 'cultural' | 'technical' | 'sports'
  description: string
  start_date: string
  end_date: string
  banner_url?: string
  created_at: string
}

export type Event = {
  id: string
  fest_id: string
  name: string
  description: string
  event_date: string
  venue?: string
  created_at: string
}

export type Winner = {
  id: string
  event_id: string
  student_name: string
  class_name: string
  department: string
  medal: 'gold' | 'silver' | 'bronze'
  created_at: string
}

export type Gallery = {
  id: string
  fest_id: string
  event_id?: string
  title: string
  description?: string
  image_url: string
  created_at: string
}

export type Draft = {
  id: string
  title: string
  content: string
  file_url?: string
  status: 'draft' | 'published'
  published_at?: string
  created_by: string
  created_at: string
}

export type EmailLog = {
  id: string
  draft_id?: string
  subject: string
  recipients: string[]
  sent_at: string
  status: 'sent' | 'failed'
}
