import { useChatStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, MessageSquare, Loader2, PanelLeftClose, PanelLeft, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatHistorySidebarProps {
  agentId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatHistorySidebar = ({ agentId, isOpen, onToggle }: ChatHistorySidebarProps) => {
  const { sessions, sessionId, switchSession, createNewSession, deleteSession, loadingSessions } = useChatStore();
  const isMobile = useIsMobile();

  const handleNewChat = () => {
    createNewSession(agentId);
    if (isMobile) onToggle();
  };

  const handleDelete = (id: string) => {
    deleteSession(id, agentId);
  };

  const handleSelectSession = (id: string) => {
    switchSession(id);
    if (isMobile) onToggle();
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Hoje";
    if (isYesterday(date)) return "Ontem";
    return format(date, "dd MMM", { locale: ptBR });
  };

  const sessionList = (
    <>
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
            <div
              key={s.id}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group flex items-start gap-2 relative",
                s.id === sessionId
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <button
                onClick={() => handleSelectSession(s.id)}
                className="flex items-start gap-2 min-w-0 flex-1 text-left"
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

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta conversa? Todas as mensagens serão perdidas permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(s.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // Mobile: render as Sheet drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-3 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-sm font-semibold">Histórico</SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleNewChat} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
            {sessionList}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: inline sidebar
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
        {sessionList}
      </ScrollArea>
    </div>
  );
};

export default ChatHistorySidebar;
