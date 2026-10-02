import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// Proxy endpoint for Supabase
app.all('/api/supabase/*', async (req, res) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase config' })
    }

    // Build Supabase URL
    const path = req.url.replace('/api/supabase', '')
    const targetUrl = `${supabaseUrl}${path}`

    console.log(`${req.method} ${targetUrl}`)

    // Forward request to Supabase
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.json().catch(() => ({}))
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app
