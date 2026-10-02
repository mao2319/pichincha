export default async function handler(req, res) {
  try {
    const { method, url, headers, body } = req

    // Get Supabase credentials from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    console.log('Proxy request:', {
      method,
      path: url,
      supabaseUrl: supabaseUrl?.substring(0, 30) + '...',
      keyLength: supabaseKey?.length,
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
      return res.status(500).json({
        error: 'Missing Supabase configuration',
      })
    }

    // Extract path after /api/supabase-proxy
    const pathAfterProxy = url.replace('/api/supabase-proxy', '')

    // Build the Supabase REST URL
    const supabaseRestUrl = `${supabaseUrl}${pathAfterProxy}`

    console.log('Proxying to:', supabaseRestUrl)

    // Prepare fetch options
    const fetchOptions = {
      method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    }

    // Add body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD' && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    // Forward the request to Supabase
    const response = await fetch(supabaseRestUrl, fetchOptions)
    const responseData = await response.json().catch(() => ({}))

    console.log('Supabase response:', {
      status: response.status,
      hasData: !!responseData,
    })

    // Return Supabase's response
    return res.status(response.status).json(responseData)
  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
