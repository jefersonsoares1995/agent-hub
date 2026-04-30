# AgentesAI

> **Plataforma de Agentes de IA para Produtividade Digital**

[![MVP Status](https://img.shields.io/badge/MVP-Validado-00B4B4?style=flat-square)](https://id-preview--f9bb3edc-11fa-4d4f-b896-2c1e66eb5ea0.lovable.app/agentes)
[![Nota Média](https://img.shields.io/badge/Satisfação-4.6%2F5.0-brightgreen?style=flat-square)]()
[![Participantes](https://img.shields.io/badge/Testes-5%20usuários-blue?style=flat-square)]()

---

## O Problema

Profissionais de produto, tech leads e pequenos empreendedores desperdiçam horas por semana em tarefas repetitivas de documentação e comunicação técnica:

- **Estruturar prompts** para obter respostas úteis de IAs genéricas exige conhecimento técnico avançado
- **Organizar notas de reunião** em tarefas acionáveis consome tempo que poderia ir para execução
- **Transformar changelogs técnicos** em posts de marketing exige trocar completamente de contexto

O resultado: até 40% do tempo de trabalho dessas pessoas vai para tarefas de baixo impacto estratégico.

---

## A Ideia do Produto

**AgentesAI** é uma plataforma SaaS com agentes de IA especializados, pré-configurados para os fluxos mais críticos do ciclo de vida de produto. Em vez de uma interface genérica de chat, o usuário acessa agentes prontos para tarefas específicas, cada um com um prompt de sistema otimizado internamente.

### Os 3 Agentes do MVP

| Agente | Input | Output |
|---|---|---|
| **Idea → Tech** | Descrição informal de uma ideia | Especificação técnica completa (stack, user stories, arquitetura, roadmap) |
| **Meeting → Tasks** | Notas ou transcrição de reunião | Backlog estruturado com tarefas e próximos passos |
| **Changelog → Posts** | Changelog técnico do produto | Posts prontos para LinkedIn, Twitter e Instagram |

### Modelo de Negócio

Sistema de créditos pay-as-you-go:
- 10 créditos — R$ 9,90
- 30 créditos — R$ 24,90 *(mais popular)*
- 100 créditos — R$ 69,90

Cada uso de agente consome 1 a 3 créditos conforme a complexidade.

---

## Protótipo Criado

O MVP funcional foi construído com as seguintes ferramentas:

- **[Lovable](https://lovable.dev)** — geração do frontend React completo a partir de descrições em linguagem natural
- **[n8n](https://n8n.io)** — orquestração dos agentes de IA (automações com LLMs via webhook)
- **OpenAI GPT-4.1-mini** — modelo de linguagem utilizado nos agentes
- **Redis** — memória de conversas por sessão
- **Supabase** — banco de dados e autenticação

### Telas Implementadas

1. **Login** — autenticação via e-mail/senha e Google OAuth
2. **Dashboard de Agentes** — seleção do agente desejado
3. **Chat do Agente** — interface de conversa com histórico
4. **Compra de Créditos** — tela de recarga (pagamento mockado no MVP)

### Acesso ao Protótipo

🔗 [https://id-preview--f9bb3edc-11fa-4d4f-b896-2c1e66eb5ea0.lovable.app/agentes](https://id-preview--f9bb3edc-11fa-4d4f-b896-2c1e66eb5ea0.lovable.app/agentes)

---

## Experimento de Validação

### Metodologia

Demonstração guiada do protótipo funcional com **5 profissionais** representativos do público-alvo. Cada participante interagiu livremente com os três agentes e forneceu feedback qualitativo e quantitativo.

### Perfil dos Participantes

| # | Nome | Cargo |
|---|---|---|
| 1 | Ricardo Oliveira | Gerente de Projetos |
| 2 | Ana Souza | Desenvolvedora Full Stack |
| 3 | Felipe Santos | Analista de Sistemas |
| 4 | Juliana Lima | Coordenadora de Marketing |
| 5 | Lucas Mendes | Dono de Pequena Empresa |

---

## Resultados da Validação

### Notas de Satisfação

| Participante | Nota (1–5) |
|---|---|
| Ricardo Oliveira | ⭐⭐⭐⭐⭐ 5.0 |
| Ana Souza | ⭐⭐⭐⭐ 4.0 |
| Felipe Santos | ⭐⭐⭐⭐ 4.0 |
| Juliana Lima | ⭐⭐⭐⭐⭐ 5.0 |
| Lucas Mendes | ⭐⭐⭐⭐⭐ 5.0 |
| **Média** | **4.6 / 5.0** |

### Feedbacks Principais

> *"A automação de notas de reunião para tarefas é o que eu mais precisava. Economiza um tempo enorme de digitação."* — Ricardo Oliveira, Gerente de Projetos

> *"O agente que gera a arquitetura técnica ajuda muito no início de novos projetos."* — Ana Souza, Dev Full Stack

> *"Interface muito rápida e intuitiva. Gostaria de ver uma opção para exportar os resultados direto para o Excel."* — Felipe Santos, Analista de Sistemas

> *"Perfeito para criar posts de atualização do sistema. O login com Google torna tudo muito prático."* — Juliana Lima, Marketing

> *"Como não tenho equipe técnica, o agente que explica a tecnologia me ajuda a entender o que preciso contratar."* — Lucas Mendes, Empreendedor

### Insights Obtidos

1. **Exportação de dados** é uma feature desejada (Felipe Santos) — adicionar na V1
2. **Usuários não-técnicos** enxergam alto valor no Idea→Tech — comunicação de marketing deve enfatizar esse benefício
3. **Login com Google** foi mencionado como diferencial de UX — manter como prioridade
4. **Meeting→Tasks** teve o maior impacto imediato percebido — pode ser o principal canal de aquisição

---

## Conclusões

### Decisão: ✅ SEGUIR

Com nota média de **4.6/5.0** e **5/5 participantes** demonstrando intenção de uso regular, os critérios de sucesso foram amplamente atingidos.

### Próximos Passos (V1)

- [ ] Integração real com Stripe para pagamentos
- [ ] Exportação de resultados para PDF/Excel
- [ ] Novo agente: **Brief → PRD** (Product Requirements Document)
- [ ] Dashboard de histórico com busca e filtros
- [ ] Planos de assinatura mensal

### Aprendizados do Processo

O uso de ferramentas de IA na construção do próprio produto (Lovable para o frontend, n8n para os agentes, Claude para ideação) demonstrou na prática o valor que a plataforma entrega: **IAs especializadas em tarefas específicas entregam resultados superiores a IAs genéricas**, com menor curva de aprendizado para o usuário final.

---

## Stack Técnica

```
Frontend:   React + TypeScript (gerado via Lovable)
Backend:    n8n (orquestração de agentes via webhooks)
LLM:        OpenAI GPT-4.1-mini
Memória:    Redis Chat Memory
Database:   Supabase (PostgreSQL)
Auth:       Supabase Auth + Google OAuth
```

---

## Arquitetura dos Agentes (n8n)

```
User Input
    │
    ▼
[Webhook Trigger]
    │
    ▼
[AI Agent Node]
    ├── LLM: OpenAI GPT-4.1-mini
    └── Memory: Redis (por session token)
    │
    ▼
[Respond to Webhook]
    │
    ▼
Frontend (Lovable)
```

Cada agente possui um `systemMessage` diferente, configurado diretamente no n8n, definindo o papel, limitações, estilo e instruções de saída esperadas.

---

*Projeto desenvolvido para a disciplina Metodologias Ágeis e Validação de Produtos — UniFECAF*
