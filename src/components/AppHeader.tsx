import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { useCreditsStore } from "@/lib/store";
import { Coins, LogOut, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  const { user, logout } = useAuthStore();
  const { balance } = useCreditsStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/agentes" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">AgentesAI</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/creditos"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              balance > 0
                ? "border-credit-positive/30 text-credit-positive"
                : "border-credit-zero/30 text-credit-zero"
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>{balance} créditos</span>
          </Link>

          <Link to="/conta">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
          </Link>

          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
