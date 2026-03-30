import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-surface px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Bot className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Entrar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesse seus agentes de IA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card border-border"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card border-border"
          />
          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
