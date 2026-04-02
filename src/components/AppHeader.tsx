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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/40 backdrop-blur-lg">
      {/* Animated bottom border Beam Effect */}
      <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] opacity-70">
        <div className="h-full w-full bg-[linear-gradient(90deg,transparent,var(--primary-color),transparent)] bg-[length:200%_100%] animate-holo-shift" />
      </div>

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/agentes" className="group flex items-center gap-2">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 border border-white/10 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Bot className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="font-heading text-xl font-bold tracking-tight text-white transition-all group-hover:text-primary">
            AgentesAI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/creditos">
            <motion.div
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coins className="h-4 w-4" />
              <span>{balance} créditos</span>
            </motion.div>
          </Link>

          <Link to="/conta" className="flex items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100">
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </motion.div>
          </Link>

          <ThemeSwitcher />

          <button onClick={handleLogout} className="flex items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
