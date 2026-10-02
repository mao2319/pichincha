export default function handler(req, res) {
  res.status(200).json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
    },
  })
}
