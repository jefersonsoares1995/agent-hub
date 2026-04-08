

## Integração dos Agentes com Webhooks n8n via Edge Function

### Objetivo
Substituir o `mockGenerate()` por chamadas reais aos webhooks do n8n, usando uma Edge Function como proxy seguro.

### Mapeamento dos Agentes

| agentId | Webhook URL |
|---|---|
| `idea-to-tech` | `https://primary-production-51cb1e.up.railway.app/webhook/idea_to_tech1` |
| `meeting-to-tasks` | `https://primary-production-51cb1e.up.railway.app/webhook/meeting_to_tasks1` |
| `changelog-to-posts` | `https://primary-production-51cb1e.up.railway.app/webhook/changelog_to_posts1` |

### Arquivos a criar/modificar

**1. `supabase/functions/agent-generate/index.ts`** (novo)
- Recebe `{ agentId, input }` via POST
- Valida o JWT do usuário (extrai access token do header Authorization)
- Mapeia `agentId` → URL do webhook usando um dicionário interno
- Faz fetch para o webhook do n8n repassando o Bearer token e o input
- Retorna a resposta ao frontend
- Inclui CORS headers e tratamento de erros

**2. `src/pages/Chat.tsx`**
- Substitui `mockGenerate(agentId, input)` por `supabase.functions.invoke('agent-generate', { body: { agentId, input } })`
- Trata a resposta (o formato dependerá do retorno do n8n — texto ou JSON)
- Mantém o fluxo de dedução de créditos e exibição de mensagem

### Detalhes técnicos

- A Edge Function mantém as URLs dos webhooks no servidor, sem expô-las ao browser
- O token do usuário logado é repassado automaticamente pelo `supabase.functions.invoke()`
- A Edge Function repassa esse mesmo token ao n8n no header Authorization
- Não são necessários secrets adicionais (as URLs são hardcoded na Edge Function)

