

## Plan: Integrate Real n8n Webhook Calls for Agents

### Overview
Replace the mock `mockGenerate` function with a Supabase Edge Function that proxies requests to the n8n webhooks. This keeps the webhook URLs server-side (secure) and provides a single endpoint for the frontend.

### Why an Edge Function?
Calling the Railway webhooks directly from the browser would expose the URLs and could face CORS issues. An Edge Function acts as a secure proxy.

### Steps

**1. Create Edge Function `agent-generate`**
- File: `supabase/functions/agent-generate/index.ts`
- Accepts POST with `{ agentId, input, userId }`
- Maps `agentId` to the corresponding webhook URL:
  - `idea-to-tech` → `https://primary-production-51cb1e.up.railway.app/webhook/idea_to_tech`
  - `meeting-to-tasks` → `https://primary-production-51cb1e.up.railway.app/webhook/meeting_to_tasks`
  - `changelog-to-posts` → `https://primary-production-51cb1e.up.railway.app/webhook/changelog_to_posts`
- Validates JWT from the request to ensure authenticated users only
- Forwards the payload to n8n and returns the response
- Includes CORS headers

**2. Update `Chat.tsx`**
- Replace the `mockGenerate` call with `supabase.functions.invoke('agent-generate', { body: { agentId, input, userId } })`
- Parse the response and display it in the chat

### Technical Details

- Edge Function will validate input with basic checks (agentId must be one of the three known agents, input must be non-empty)
- The n8n webhook response format will be handled flexibly — the function will attempt to extract text from the response body
- CORS headers imported from `@supabase/supabase-js/cors`

