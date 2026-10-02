import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { requestId, prospectData } = await req.json()

    if (!requestId || !prospectData) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Call Claude API to orchestrate verification
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }),
        { status: 500, headers: corsHeaders }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-5-5',
        max_tokens: 2048,
        system: `You are the Agente Orquestador (Orchestrator Agent). Your role is to coordinate the verification process.
Respond with a JSON object containing:
{
  "overallStatus": "approved|rejected|ambiguous",
  "recommendedAction": "string describing the action",
  "riskLevel": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation"
}`,
        messages: [
          {
            role: 'user',
            content: `Orchestrate verification for this prospect:\n\n${JSON.stringify(prospectData, null, 2)}`,
          },
        ],
      }),
    })

    const result = await response.json()

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    )
  }
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
