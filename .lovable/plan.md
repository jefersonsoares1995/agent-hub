

## Plano de Responsividade Mobile

Baseado nas screenshots e no codigo atual, identifiquei os seguintes problemas em mobile (viewport ~375-414px):

### Problemas Identificados

1. **Header**: Os itens ficam apertados; o texto "créditos" e os botoes de acao competem por espaco
2. **Chat - Sidebar**: A sidebar de historico (w-64 = 256px) ocupa quase toda a tela em mobile, empurrando o chat para fora da viewport
3. **Chat - Area de mensagens**: Com a sidebar aberta, o conteudo do chat fica cortado/ilegivel
4. **Pagina Agentes**: O grid de cards nao tem padding adequado em mobile
5. **Pagina Creditos**: Os cards de pacotes ficam em coluna unica mas sem ajuste de spacing
6. **Pagina Conta**: Layout ok mas pode melhorar padding

### Alteracoes Planejadas

**1. AppHeader.tsx** - Header compacto em mobile
- Esconder o texto "créditos" em telas pequenas, mostrando apenas o icone + numero
- Reduzir gaps entre elementos
- Usar `hidden sm:inline` para textos secundarios

**2. ChatHistorySidebar.tsx** - Drawer em mobile em vez de sidebar fixa
- Em mobile (< 768px): renderizar como um `Sheet` (slide-over) em vez de sidebar inline
- Em desktop: manter o comportamento atual
- Usar o hook `useIsMobile()` ja existente no projeto

**3. Chat.tsx** - Ajustes para mobile
- Iniciar com sidebar fechada em mobile (`useState(false)` quando mobile)
- Adicionar botao de toggle do historico na top bar do chat (visivel em mobile)
- Ajustar padding da area de input

**4. Agents.tsx** - Grid responsivo
- Adicionar `px-4` para padding lateral em mobile
- Cards ja ficam em coluna unica (grid sem breakpoint = 1 col), esta ok

**5. Credits.tsx** - Ajustes de spacing
- Reduzir padding do container em mobile
- Cards ja responsivos via `sm:grid-cols-3`

**6. Account.tsx** - Ajustes menores
- Melhorar padding em mobile

### Arquivos a Editar

| Arquivo | Mudanca |
|---|---|
| `src/components/AppHeader.tsx` | Header compacto mobile |
| `src/components/ChatHistorySidebar.tsx` | Sheet/drawer em mobile |
| `src/pages/Chat.tsx` | Sidebar fechada por padrao em mobile, botao toggle |
| `src/pages/Agents.tsx` | Padding mobile |
| `src/pages/Credits.tsx` | Padding mobile |
| `src/pages/Account.tsx` | Padding mobile |

A mudanca principal e transformar a sidebar do chat em um **Sheet** (drawer lateral) quando em mobile, resolvendo o problema mais critico de usabilidade mostrado nas screenshots.

