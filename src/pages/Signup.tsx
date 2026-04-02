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
  const { signup, isAuthenticated } = useAuthStore();
  const { addCredits } = useCreditsStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/agentes" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await signup(email, password, name);
      addCredits(5, "bonus");
      toast.success("Conta criada! Você ganhou 5 créditos de boas-vindas 🎉");
    } catch {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Neural Network animated background */}
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
              "0 0 20px hsl(172 66% 50% / 0.2)",
              "0 0 40px hsl(172 66% 50% / 0.4)",
              "0 0 20px hsl(172 66% 50% / 0.2)",
            ]}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">Criar Conta</h1>
          <p className="mt-1 text-sm text-slate-400">
            Comece grátis com <span className="text-cyan-400 font-bold">5 créditos</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900/40 border-white/10 backdrop-blur-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900/40 border-white/10 backdrop-blur-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Input
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900/40 border-white/10 backdrop-blur-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button type="submit" className="w-full bg-gradient-primary text-white font-bold hover:opacity-90 transition-all hover:shadow-glow" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
            </Button>
          </motion.div>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
