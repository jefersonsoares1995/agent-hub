import { Navigate } from "react-router-dom";
import { useCreditsStore } from "@/lib/store";
import { useAgentsStore } from "@/lib/store";
import { toast } from "sonner";
import { useEffect } from "react";

interface CreditGuardProps {
  agentId: string;
  children: React.ReactNode;
}

const CreditGuard = ({ agentId, children }: CreditGuardProps) => {
  const { balance } = useCreditsStore();
  const { getAgent } = useAgentsStore();
  const agent = getAgent(agentId);
  const cost = agent?.creditCost ?? 1;
  const hasCredits = balance >= cost;

  useEffect(() => {
    if (!hasCredits) {
      toast.error("Créditos insuficientes", {
        description: `Você precisa de ${cost} crédito(s) para usar este agente.`,
      });
    }
  }, [hasCredits, cost]);

  if (!hasCredits) {
    return <Navigate to="/creditos" replace />;
  }

  return <>{children}</>;
};

export default CreditGuard;
