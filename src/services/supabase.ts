import { createClient } from '@supabase/supabase-js'

// Force rebuild: 2026-10-02T15:00:00Z
// Vercel rebuild trigger - ensures fresh compilation

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '') as string
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '') as string

console.log('Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('URL length:', supabaseUrl?.length)
console.log('URL bytes:', new TextEncoder().encode(supabaseUrl).length)
console.log('URL chars:', Array.from(supabaseUrl).map(c => `${c}(${c.charCodeAt(0)})`).join(','))
// Export key for debugging
(window as any).DEBUG_SUPABASE_KEY = supabaseKey
(window as any).DEBUG_KEY_LENGTH = supabaseKey?.length
(window as any).DEBUG_KEY_HEX = supabaseKey ? Array.from(supabaseKey).map((c: string) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ') : ''

console.log('Key (FULL - COPY THIS):', supabaseKey)
console.log('Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...')
console.log('Key length:', supabaseKey?.length)
console.log('Use window.DEBUG_SUPABASE_KEY to access the key object')
console.log('Key (LAST 50 chars):', '...' + supabaseKey?.substring(supabaseKey.length - 50))
console.log('Key first char code:', supabaseKey?.charCodeAt(0))
console.log('Key last char code:', supabaseKey?.charCodeAt(supabaseKey.length - 1))
// Check for whitespace
const hasLeadingSpace = supabaseKey?.[0] === ' '
const hasTrailingSpace = supabaseKey?.[supabaseKey.length - 1] === ' '
console.log('Has leading/trailing space:', hasLeadingSpace, hasTrailingSpace)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

console.log('Supabase client initialized successfully')

// Database operations
export const supabaseDb = {
  // Prospect operations
  async createProspect(data: any) {
    try {
      console.log('Creating prospect with data:', data)
      const { data: prospect, error } = await supabase
        .from('prospects')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        throw new Error(`Failed to create prospect: ${error.message} (code: ${error.code})`)
      }
      console.log('Prospect created successfully:', prospect)
      return prospect
    } catch (error) {
      console.error('createProspect error:', error)
      throw error
    }
  },

  async getProspect(id: string) {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Onboarding Request operations
  async createOnboardingRequest(data: any) {
    try {
      console.log('Creating onboarding request with data:', data)
      const { data: request, error } = await supabase
        .from('onboarding_requests')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        throw new Error(`Failed to create request: ${error.message} (code: ${error.code})`)
      }
      console.log('Onboarding request created successfully:', request)
      return request
    } catch (error) {
      console.error('createOnboardingRequest error:', error)
      throw error
    }
  },

  async getOnboardingRequest(id: string) {
    const { data, error } = await supabase
      .from('onboarding_requests')
      .select('*, traces:agent_traces(*)')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateOnboardingRequest(id: string, updates: any) {
    const { data, error } = await supabase
      .from('onboarding_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async listOnboardingRequests(filters?: any) {
    let query = supabase
      .from('onboarding_requests')
      .select('*, traces:agent_traces(*)')
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)
    return { requests: data, count }
  },

  // Agent Trace operations
  async createAgentTrace(data: any) {
    const { data: trace, error } = await supabase
      .from('agent_traces')
      .insert([data])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return trace
  },

  async updateAgentTrace(id: string, updates: any) {
    const { data, error } = await supabase
      .from('agent_traces')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Statistics
  async getStatistics() {
    const { data, error } = await supabase
      .rpc('get_statistics')

    if (error) throw new Error(error.message)
    return data
  },

  // Real-time subscriptions
  subscribeToOnboardingRequests(
    callback: (payload: any) => void,
    _statusFilter?: string
  ) {
    return supabase
      .channel('onboarding_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_requests',
        },
        callback
      )
      .subscribe()
  },

  subscribeToAgentTraces(requestId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`agent_traces_${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_traces',
          filter: `request_id=eq.${requestId}`,
        },
        callback
      )
      .subscribe()
  },
}
