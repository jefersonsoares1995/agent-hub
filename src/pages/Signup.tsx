import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore, useCreditsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";

const Signup = () => {
  const { signup, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuthStore();
  const { addCredits } = useCreditsStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to="/agentes" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await signup(email, password, name);
      addCredits(5, "bonus");
      toast.success("Conta criada! Verifique seu e-mail para confirmar 📧");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao conectar com Google");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      <NeuralNetworkBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary glow-primary"
            animate={{ boxShadow: [
              "0 0 20px var(--primary-color) / 0.2",
              "0 0 40px var(--primary-color) / 0.4",
              "0 0 20px var(--primary-color) / 0.2",
            ]}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">Criar Conta</h1>
          <p className="mt-1 text-sm text-slate-400">
            Comece grátis com <span className="text-primary font-bold">5 créditos</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900/40 border-white/10 backdrop-blur-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary transition-all"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900/40 border-white/10 backdrop-blur-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary transition-all"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Input
              type="password"
              placeholder="Crie uma senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900/40 border-white/10 backdrop-blur-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary transition-all"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button type="submit" className="w-full bg-gradient-primary text-white font-bold hover:opacity-90 transition-all hover:shadow-glow" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.55 }}
            className="relative flex items-center py-2"
          >
            <div className="flex-grow border-t border-white/5"></div>
            <span className="mx-4 flex-shrink text-xs font-medium uppercase text-slate-500">ou</span>
            <div className="flex-grow border-t border-white/5"></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white/5 border border-white/10 text-white text-sm font-normal hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
              </svg>
              Continuar com Google
            </Button>
          </motion.div>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-primary hover:opacity-80 transition-colors">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
