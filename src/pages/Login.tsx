import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";

const Login = () => {
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/agentes" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bem-vindo de volta!");
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-surface px-4 overflow-hidden">
      {/* Futuristic grid background */}
      <div className="absolute inset-0 futuristic-grid opacity-60" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

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
          <h1 className="font-heading text-2xl font-bold text-foreground">Entrar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesse seus agentes de IA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card border-border focus:border-primary/50 focus:glow-primary transition-shadow"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-card border-border focus:border-primary/50 transition-shadow"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all hover:shadow-glow" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </motion.div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
