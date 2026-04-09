import { useChatStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, MessageSquare, Loader2, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatHistorySidebarProps {
  agentId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatHistorySidebar = ({ agentId, isOpen, onToggle }: ChatHistorySidebarProps) => {
  const { sessions, sessionId, switchSession, createNewSession, loadingSessions } = useChatStore();

  const handleNewChat = () => {
    createNewSession(agentId);
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Hoje";
    if (isYesterday(date)) return "Ontem";
    return format(date, "dd MMM", { locale: ptBR });
  };

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center py-3 px-1 border-r border-border bg-card/50">
        <Button variant="ghost" size="icon" onClick={onToggle} className="text-muted-foreground mb-2">
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleNewChat} className="text-muted-foreground">
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64 border-r border-border bg-card/50 shrink-0">
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleNewChat} className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loadingSessions ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-muted-foreground">Nenhuma conversa ainda</p>
          </div>
        ) : (
          <div className="py-2 px-2 space-y-1">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => switchSession(s.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group flex items-start gap-2",
                  s.id === sessionId
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-snug">
                    {s.title || "Nova conversa"}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {formatDate(s.updatedAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatHistorySidebar;
