import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";
import { Agent } from "@/lib/types";

interface AgentIntro {
  welcome: string;
  suggestions: string[];
}

const AGENT_INTROS: Record<string, AgentIntro> = {
  "idea-to-tech": {
    welcome:
      "Olá! Sou seu Arquiteto de Soluções. Me conte sua ideia de projeto e eu vou estruturar a stack, arquitetura e os requisitos técnicos para você começar.",
    suggestions: [
      "Arquitetura para app de Delivery",
      "Stack para SaaS de IA",
      "Requisitos de um marketplace B2B",
    ],
  },
  "meeting-to-tasks": {
    welcome:
      "Pronto para organizar o caos? Cole as notas ou a transcrição da sua reunião aqui para que eu possa gerar seu backlog de tarefas e próximos passos.",
    suggestions: [
      "Resumir reunião de alinhamento",
      "Gerar lista de responsáveis",
      "Extrair próximos passos",
    ],
  },
  "changelog-to-posts": {
    welcome:
      "Vamos transformar progresso em engajamento? Me envie o changelog técnico ou as atualizações do app para eu criar posts de marketing impactantes.",
    suggestions: [
      "Post para LinkedIn de release v2.0",
      "Tweet curto sobre nova feature",
      "Anúncio de update no Instagram",
    ],
  },
};

interface ChatEmptyStateProps {
  agent: Agent;
  onSuggestionClick: (suggestion: string) => void;
}

const ChatEmptyState = ({ agent, onSuggestionClick }: ChatEmptyStateProps) => {
  const intro = AGENT_INTROS[agent.id] ?? {
    welcome: `Olá! Sou o agente ${agent.name}. Como posso te ajudar hoje?`,
    suggestions: [],
  };
  const IconComponent = (LucideIcons as Record<string, React.ElementType>)[agent.icon];

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in space-y-4 py-4">
      {/* Welcome card — styled like an assistant message */}
      <div className="flex gap-2 sm:gap-3">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          {IconComponent ? (
            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          ) : (
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 rounded-2xl rounded-tl-sm border border-border/60 bg-card/40 backdrop-blur-sm px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-primary mb-1">{agent.name}</p>
          <p className="text-sm sm:text-[15px] leading-relaxed text-foreground">
            {intro.welcome}
          </p>
        </div>
      </div>

      {/* Quick action suggestions */}
      {intro.suggestions.length > 0 && (
        <div className="pl-10 sm:pl-12">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Sugestões para começar
          </p>
          <div className="flex flex-wrap gap-2">
            {intro.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(s)}
                className="group rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs sm:text-sm text-foreground/90 transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatEmptyState;
