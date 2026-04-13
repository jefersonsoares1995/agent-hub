import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAgentsStore, useChatStore, useCreditsStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import CreditGuard from "@/components/CreditGuard";
import ChatBubble from "@/components/ChatBubble";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Send, PanelLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";

const ChatContent = ({ agentId }: { agentId: string }) => {
  const { getAgent } = useAgentsStore();
  const { messages, addMessage, persistMessage, isGenerating, setGenerating, initSession, loadingHistory } = useChatStore();
  const { balance, deduct } = useCreditsStore();
  const [input, setInput] = useState("");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const agent = getAgent(agentId)!;
  const IconComponent = (LucideIcons as any)[agent?.icon || ""] as React.ElementType;

  // Update sidebar state when switching between mobile/desktop
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    initSession(agentId);
  }, [agentId, initSession]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;

    if (balance < agent.creditCost) {
      toast.error("Créditos insuficientes");
      return;
    }

    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: input, createdAt: new Date() };
    addMessage(userMsg);
    await persistMessage(userMsg);
    setInput("");
    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('agent-generate', {
        body: { agentId, input },
      });
      if (error) throw error;
      const output = data?.output || "Sem resposta do agente.";
      await deduct(agent.creditCost, agent.name);
      const assistantMsg = { id: crypto.randomUUID(), role: "assistant" as const, content: output, createdAt: new Date() };
      addMessage(assistantMsg);
      await persistMessage(assistantMsg);
    } catch {
      toast.error("Erro ao gerar resposta");
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
      <ChatHistorySidebar agentId={agentId} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-border px-3 sm:px-4 py-2 sm:py-3">
          <Link to="/agentes">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setSidebarOpen(true)}>
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-primary/10">
            {IconComponent ? <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /> : <span className="text-xl sm:text-2xl">{agent.icon}</span>}
          </div>
          <div className="min-w-0">
            <h2 className="font-heading text-sm font-semibold text-foreground truncate">{agent.name}</h2>
            <p className="text-xs text-muted-foreground">{agent.creditCost} crédito por uso</p>
          </div>
        </div>

        {/* Messages */}
        {loadingHistory ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center px-4">
                  <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 mb-4 shadow-[0_0_15px_var(--primary-color,rgba(6,182,212,0.1))]">
                    {IconComponent ? <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-primary" /> : <span className="text-4xl sm:text-5xl">{agent.icon}</span>}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">Digite seu input e clique em Gerar</p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Gerando resposta...
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-3 sm:p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Descreva seu input para ${agent.name}...`}
              className="min-h-[44px] max-h-32 resize-none bg-card border-border text-sm"
              rows={1}
            />
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shrink-0"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { clearMessages } = useChatStore();

  useEffect(() => {
    clearMessages();
  }, [agentId, clearMessages]);

  if (!agentId) return null;

  return (
    <CreditGuard agentId={agentId}>
      <ChatContent agentId={agentId} />
    </CreditGuard>
  );
};

export default Chat;
