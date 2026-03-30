import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { useCreditsStore } from "@/lib/store";
import { Coins, LogOut, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const AppHeader = () => {
  const { user, logout } = useAuthStore();
  const { balance } = useCreditsStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur-2xl">
      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container flex h-16 items-center justify-between">
        <Link to="/agentes" className="flex items-center gap-2 group">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Bot className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-heading text-lg font-bold text-foreground group-hover:text-gradient-primary transition-all">
            AgentesAI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/creditos">
            <motion.div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                balance > 0
                  ? "border-credit-positive/30 text-credit-positive"
                  : "border-credit-zero/30 text-credit-zero"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coins className="h-4 w-4" />
              <span>{balance} créditos</span>
            </motion.div>
          </Link>

          <Link to="/conta">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </motion.div>
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
