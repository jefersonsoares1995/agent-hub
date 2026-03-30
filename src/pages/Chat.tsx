import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAgentsStore, useChatStore, useCreditsStore } from "@/lib/store";
import { mockGenerate } from "@/lib/mock";
import CreditGuard from "@/components/CreditGuard";
import ChatBubble from "@/components/ChatBubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

const ChatContent = ({ agentId }: { agentId: string }) => {
  const { getAgent } = useAgentsStore();
  const { messages, addMessage, isGenerating, setGenerating } = useChatStore();
  const { balance, deduct } = useCreditsStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const agent = getAgent(agentId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;

    if (balance < agent.creditCost) {
      toast.error("Créditos insuficientes");
      return;
    }

    const userMsg = { id: `msg-${Date.now()}`, role: "user" as const, content: input, createdAt: new Date() };
    addMessage(userMsg);
    setInput("");
    setGenerating(true);

    try {
      const output = await mockGenerate(agentId, input);
      deduct(agent.creditCost, agent.name);
      addMessage({ id: `msg-${Date.now() + 1}`, role: "assistant", content: output, createdAt: new Date() });
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
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link to="/agentes">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-2xl">{agent.icon}</span>
        <div>
          <h2 className="font-heading text-sm font-semibold text-foreground">{agent.name}</h2>
          <p className="text-xs text-muted-foreground">{agent.creditCost} crédito por uso</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <span className="text-5xl">{agent.icon}</span>
              <p className="mt-4 text-muted-foreground">Digite seu input e clique em Gerar</p>
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

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Descreva seu input para ${agent.name}...`}
            className="min-h-[44px] max-h-32 resize-none bg-card border-border"
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
