export default async function handler(req, res) {
  try {
    console.log('=== PROXY REQUEST ===')
    const { method, url, headers, body } = req

    // Get Supabase credentials from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    console.log('Method:', method)
    console.log('URL:', url)
    console.log('Env - Supabase URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.log('Env - Supabase Key:', supabaseKey ? `SET (${supabaseKey.length} chars)` : 'MISSING')

    if (!supabaseUrl || !supabaseKey) {
      console.error('ERROR: Missing Supabase configuration')
      return res.status(500).json({
        error: 'Missing Supabase configuration',
        details: { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey },
      })
    }

    // Extract path after /api/supabase-proxy
    let pathAfterProxy = url
    if (url.includes('/api/supabase-proxy')) {
      pathAfterProxy = url.substring(url.indexOf('/api/supabase-proxy') + '/api/supabase-proxy'.length)
    }

    // Ensure path starts with /
    if (!pathAfterProxy.startsWith('/')) {
      pathAfterProxy = '/' + pathAfterProxy
    }

    // Build the Supabase REST URL
    const supabaseRestUrl = `${supabaseUrl}${pathAfterProxy}`

    console.log('Path after proxy:', pathAfterProxy)
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
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body)
      fetchOptions.body = bodyStr
      console.log('Body:', bodyStr.substring(0, 100))
    }

    console.log('Fetching from Supabase...')

    // Forward the request to Supabase
    let response
    try {
      response = await fetch(supabaseRestUrl, fetchOptions)
    } catch (fetchError) {
      console.error('FETCH ERROR:', fetchError.message)
      return res.status(500).json({
        error: 'Failed to connect to Supabase',
        message: fetchError.message,
      })
    }

    console.log('Supabase response status:', response.status)

    let responseData
    try {
      responseData = await response.json()
    } catch (jsonError) {
      console.log('Failed to parse JSON, using empty object')
      responseData = {}
    }

    console.log('Returning status:', response.status)
    console.log('=== PROXY COMPLETE ===')

    // Return Supabase's response
    res.status(response.status).json(responseData)
  } catch (error) {
    console.error('=== PROXY ERROR ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error.message,
    })
  }
}
