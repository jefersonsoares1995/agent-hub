import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WEBHOOK_MAP: Record<string, string> = {
  'idea-to-tech': 'https://primary-production-51cb1e.up.railway.app/webhook/idea_to_tech',
  'meeting-to-tasks': 'https://primary-production-51cb1e.up.railway.app/webhook/meeting_to_tasks',
  'changelog-to-posts': 'https://primary-production-51cb1e.up.railway.app/webhook/changelog_to_posts',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const userId = claimsData.claims.sub

    // Parse & validate body
    const body = await req.json()
    const { agentId, input } = body

    if (!agentId || typeof agentId !== 'string' || !WEBHOOK_MAP[agentId]) {
      return new Response(JSON.stringify({ error: 'Invalid agentId' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Input is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (input.length > 10000) {
      return new Response(JSON.stringify({ error: 'Input too long' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Call n8n webhook
    const webhookUrl = WEBHOOK_MAP[agentId]
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, agentId, input: input.trim() }),
    })

    if (!webhookResponse.ok) {
      const errText = await webhookResponse.text()
      console.error('Webhook error:', webhookResponse.status, errText)
      return new Response(JSON.stringify({ error: 'Agent processing failed' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Parse response flexibly
    const rawText = await webhookResponse.text()
    let output: string

    try {
      const json = JSON.parse(rawText)
      output = json.output || json.text || json.message || json.result || JSON.stringify(json)
    } catch {
      output = rawText
    }

    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
