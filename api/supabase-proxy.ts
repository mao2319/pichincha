import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { method, body, query } = req

    // Get Supabase credentials from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Missing Supabase configuration',
      })
    }

    // Build the Supabase REST URL
    const queryString = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&')

    const supabaseRestUrl = `${supabaseUrl}/rest/v1${req.url.replace('/api/supabase-proxy', '')}${
      queryString ? '?' + queryString : ''
    }`

    console.log(`Proxying ${method} request to: ${supabaseRestUrl}`)

    // Forward the request to Supabase
    const response = await fetch(supabaseRestUrl, {
      method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.json()

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
