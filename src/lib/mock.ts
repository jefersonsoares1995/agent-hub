import { Agent, ChatMessage, CreditTransaction, User } from "./types";

export const MOCK_USER: User = {
  id: "user-001",
  email: "demo@agentes.ai",
  displayName: "Demo User",
  avatarUrl: undefined,
};

export const MOCK_AGENTS: Agent[] = [
  {
    id: "idea-to-tech",
    slug: "idea-to-tech",
    name: "Idea → Tech",
    description: "Converte seu brainstorm em definições técnicas estruturadas: stack, arquitetura, user stories e estimativas.",
    icon: "💡",
    category: "Desenvolvimento",
    creditCost: 1,
    active: true,
    color: "172 66% 50%",
  },
  {
    id: "meeting-to-tasks",
    slug: "meeting-to-tasks",
    name: "Meeting → Tasks",
    description: "Transforma notas de reunião em bullets organizados com ações, responsáveis e prazos.",
    icon: "📋",
    creditCost: 2,
    active: true,
    color: "260 60% 60%",
  },
  {
    id: "changelog-to-posts",
    slug: "changelog-to-posts",
    name: "Changelog → Posts",
    description: "Gera posts de update do app a partir do changelog técnico, prontos para redes sociais.",
    icon: "📣",
    creditCost: 3,
    active: true,
    color: "38 92% 50%",
  },
];

export const MOCK_BALANCE = 5;

export const MOCK_TRANSACTIONS: CreditTransaction[] = [
  { id: "tx-1", amount: 10, reason: "bonus", description: "Bônus de boas-vindas", createdAt: new Date("2026-03-28") },
  { id: "tx-2", amount: -1, reason: "usage", description: "Idea → Tech", createdAt: new Date("2026-03-29") },
  { id: "tx-3", amount: -1, reason: "usage", description: "Meeting → Tasks", createdAt: new Date("2026-03-29") },
  { id: "tx-4", amount: -1, reason: "usage", description: "Changelog → Posts", createdAt: new Date("2026-03-30") },
  { id: "tx-5", amount: -2, reason: "usage", description: "Idea → Tech", createdAt: new Date("2026-03-30") },
];

const MOCK_RESPONSES: Record<string, string> = {
  "idea-to-tech": `## Definição Técnica

**Stack sugerida:** React + TypeScript + Supabase + Tailwind CSS

**Arquitetura:**
- Frontend SPA com React Router
- Backend serverless com Supabase Edge Functions
- Banco PostgreSQL via Supabase
- Autenticação JWT integrada

**User Stories:**
1. Como usuário, quero descrever minha ideia em linguagem natural
2. Como dev, quero receber a arquitetura sugerida automaticamente
3. Como PM, quero ver estimativas de esforço por feature

**Estimativa:** 2-3 sprints para MVP`,
  "meeting-to-tasks": `## Resumo da Reunião

**Decisões:**
- ✅ Adotar arquitetura de microserviços
- ✅ Sprint de 2 semanas
- ✅ Deploy contínuo via GitHub Actions

**Ações:**
| Responsável | Tarefa | Prazo |
|---|---|---|
| @joao | Configurar CI/CD | 02/04 |
| @maria | Criar protótipo do dashboard | 04/04 |
| @pedro | Documentar APIs | 03/04 |

**Próxima reunião:** 07/04 às 10h`,
  "changelog-to-posts": `## 🚀 Update v2.4.0

Novidades fresquinhas no app! Confira o que mudou:

**✨ Novo:** Dashboard redesenhado com métricas em tempo real
**⚡ Melhoria:** Tempo de carregamento 40% mais rápido
**🐛 Fix:** Correção no login com Google em dispositivos iOS

Atualize agora e aproveite! 💪

#update #changelog #produto`,
};

export async function mockGenerate(agentId: string, _input: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1200));
  return MOCK_RESPONSES[agentId] || "Resposta mockada para o agente " + agentId;
}
