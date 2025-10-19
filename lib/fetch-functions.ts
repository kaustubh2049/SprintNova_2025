import { supabase } from './supabase'
import type { Fest, Event, Winner, Gallery, Draft } from './supabase'

// ============================================
// STANDINGS FETCH FUNCTIONS
// ============================================

/**
 * Fetch all winners data for standings
 */
export async function fetchAllWinners() {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select(`
        *,
        events (
          id,
          name,
          fest_id,
          fests (
            id,
            name,
            type
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching winners:', error)
    return { data: null, error }
  }
}

/**
 * Fetch winners grouped by fest
 */
export async function fetchWinnersByFest() {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select(`
        *,
        events (
          id,
          name,
          fest_id,
          fests (
            id,
            name,
            type
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group winners by fest
    const groupedWinners = data?.reduce((acc: any, winner: any) => {
      const festId = winner.events?.fests?.id
      const festName = winner.events?.fests?.name
      const festType = winner.events?.fests?.type

      if (!acc[festId]) {
        acc[festId] = {
          festId,
          festName,
          festType,
          winners: []
        }
      }
      acc[festId].winners.push(winner)
      return acc
    }, {})

    return { data: groupedWinners, error: null }
  } catch (error) {
    console.error('Error fetching winners by fest:', error)
    return { data: null, error }
  }
}

/**
 * Fetch medal counts by department
 */
export async function fetchMedalCountsByDepartment() {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select('department, medal')
      .order('department')

    if (error) throw error

    // Calculate medal counts by department
    const medalCounts = data?.reduce((acc: any, winner: any) => {
      const dept = winner.department
      if (!acc[dept]) {
        acc[dept] = { gold: 0, silver: 0, bronze: 0, total: 0 }
      }
      acc[dept][winner.medal]++
      acc[dept].total++
      return acc
    }, {})

    return { data: medalCounts, error: null }
  } catch (error) {
    console.error('Error fetching medal counts:', error)
    return { data: null, error }
  }
}

/**
 * Fetch medal counts by class
 */
export async function fetchMedalCountsByClass() {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select('class, medal')
      .order('class')

    if (error) throw error

    // Calculate medal counts by class
    const medalCounts = data?.reduce((acc: any, winner: any) => {
      const className = winner.class
      if (!acc[className]) {
        acc[className] = { gold: 0, silver: 0, bronze: 0, total: 0 }
      }
      acc[className][winner.medal]++
      acc[className].total++
      return acc
    }, {})

    return { data: medalCounts, error: null }
  } catch (error) {
    console.error('Error fetching medal counts by class:', error)
    return { data: null, error }
  }
}

// ============================================
// ABOUT PAGE FETCH FUNCTIONS
// ============================================

/**
 * Fetch all fests for about page
 */
export async function fetchAllFests() {
  try {
    const { data, error } = await supabase
      .from('fests')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching fests:', error)
    return { data: null, error }
  }
}

/**
 * Fetch fests by type
 */
export async function fetchFestsByType(type: 'cultural' | 'technical' | 'sports') {
  try {
    const { data, error } = await supabase
      .from('fests')
      .select('*')
      .eq('type', type)
      .order('start_date', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching fests by type:', error)
    return { data: null, error }
  }
}

/**
 * Fetch upcoming fests
 */
export async function fetchUpcomingFests() {
  try {
    const { data, error } = await supabase
      .from('fests')
      .select('*')
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching upcoming fests:', error)
    return { data: null, error }
  }
}

/**
 * Fetch fest with events
 */
export async function fetchFestWithEvents(festId: string) {
  try {
    const { data, error } = await supabase
      .from('fests')
      .select(`
        *,
        events (
          id,
          name,
          description,
          event_date,
          venue
        )
      `)
      .eq('id', festId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching fest with events:', error)
    return { data: null, error }
  }
}

// ============================================
// GALLERY FETCH FUNCTIONS
// ============================================

/**
 * Fetch all gallery images
 */
export async function fetchAllGalleryImages() {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select(`
        *,
        fests (
          id,
          name,
          type
        ),
        events (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return { data: null, error }
  }
}

/**
 * Fetch gallery images by fest
 */
export async function fetchGalleryByFest(festId: string) {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select(`
        *,
        fests (
          id,
          name,
          type
        ),
        events (
          id,
          name
        )
      `)
      .eq('fest_id', festId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching gallery by fest:', error)
    return { data: null, error }
  }
}

/**
 * Fetch gallery images by event
 */
export async function fetchGalleryByEvent(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select(`
        *,
        fests (
          id,
          name,
          type
        ),
        events (
          id,
          name
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching gallery by event:', error)
    return { data: null, error }
  }
}

/**
 * Fetch recent gallery images
 */
export async function fetchRecentGalleryImages(limit: number = 12) {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select(`
        *,
        fests (
          id,
          name,
          type
        ),
        events (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching recent gallery images:', error)
    return { data: null, error }
  }
}

// ============================================
// NOTICES FETCH FUNCTIONS
// ============================================

/**
 * Fetch all published notices/announcements
 */
export async function fetchAllNotices() {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching notices:', error)
    return { data: null, error }
  }
}

/**
 * Fetch recent notices
 */
export async function fetchRecentNotices(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching recent notices:', error)
    return { data: null, error }
  }
}

/**
 * Fetch notice by ID
 */
export async function fetchNoticeById(id: string) {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching notice by ID:', error)
    return { data: null, error }
  }
}

/**
 * Fetch notices by date range
 */
export async function fetchNoticesByDateRange(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('status', 'published')
      .gte('published_at', startDate)
      .lte('published_at', endDate)
      .order('published_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching notices by date range:', error)
    return { data: null, error }
  }
}

// ============================================
// EVENTS FETCH FUNCTIONS
// ============================================

/**
 * Fetch all events
 */
export async function fetchAllEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        fests (
          id,
          name,
          type
        )
      `)
      .order('event_date', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching events:', error)
    return { data: null, error }
  }
}

/**
 * Fetch events by fest
 */
export async function fetchEventsByFest(festId: string) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        fests (
          id,
          name,
          type
        )
      `)
      .eq('fest_id', festId)
      .order('event_date', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching events by fest:', error)
    return { data: null, error }
  }
}

/**
 * Fetch upcoming events
 */
export async function fetchUpcomingEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        fests (
          id,
          name,
          type
        )
      `)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return { data: null, error }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Search across all content
 */
export async function searchContent(query: string) {
  try {
    // Search in fests
    const { data: fests, error: festsError } = await supabase
      .from('fests')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Search in events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(`
        *,
        fests (
          id,
          name,
          type
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Search in notices
    const { data: notices, error: noticesError } = await supabase
      .from('drafts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

    if (festsError || eventsError || noticesError) {
      throw festsError || eventsError || noticesError
    }

    return {
      data: {
        fests: fests || [],
        events: events || [],
        notices: notices || []
      },
      error: null
    }
  } catch (error) {
    console.error('Error searching content:', error)
    return { data: null, error }
  }
}

/**
 * Get dashboard statistics
 */
export async function fetchDashboardStats() {
  try {
    // Get counts for each table
    const [
      { count: festsCount },
      { count: eventsCount },
      { count: winnersCount },
      { count: galleryCount },
      { count: noticesCount }
    ] = await Promise.all([
      supabase.from('fests').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('winners').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('drafts').select('*', { count: 'exact', head: true }).eq('status', 'published')
    ])

    return {
      data: {
        fests: festsCount || 0,
        events: eventsCount || 0,
        winners: winnersCount || 0,
        gallery: galleryCount || 0,
        notices: noticesCount || 0
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { data: null, error }
  }
}
