import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useCreditsStore } from "@/lib/store";
import { Coins, LogOut, User, Bot, Menu, Bot as BotIcon, CreditCard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/agentes", label: "Agentes", icon: BotIcon },
  { to: "/creditos", label: "Créditos", icon: CreditCard },
  { to: "/conta", label: "Minha Conta", icon: UserCircle },
];

const AppHeader = () => {
  const { user, logout } = useAuthStore();
  const { balance } = useCreditsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/40 backdrop-blur-lg">
      {/* Animated bottom border Beam Effect */}
      <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] opacity-70">
        <div className="h-full w-full bg-[linear-gradient(90deg,transparent,var(--primary-color),transparent)] bg-[length:200%_100%] animate-holo-shift" />
      </div>

      <div className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {/* Hamburger menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-white hover:bg-white/5">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-slate-900/95 backdrop-blur-lg border-white/10">
              <SheetHeader className="px-4 py-4 border-b border-white/10">
                <SheetTitle className="text-base font-semibold text-white text-left">Navegação</SheetTitle>
              </SheetHeader>
              <nav className="p-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname.startsWith(item.to);
                  return (
                    <button
                      key={item.to}
                      onClick={() => handleNavClick(item.to)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
                <div className="my-2 border-t border-white/10" />
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/agentes" className="group flex items-center gap-2">
            <motion.div
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-slate-800 border border-white/10 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </motion.div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white transition-all group-hover:text-primary">
              AgentesAI
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/creditos">
            <motion.div
              className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{balance}</span>
              <span className="hidden sm:inline">créditos</span>
            </motion.div>
          </Link>

          <Link to="/conta" className="hidden sm:flex items-center justify-center rounded-full p-1.5 sm:p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100">
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

          <button onClick={handleLogout} className="hidden sm:flex items-center justify-center rounded-full p-1.5 sm:p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100">
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
