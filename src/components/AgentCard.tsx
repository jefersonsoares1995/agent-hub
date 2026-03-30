import { Link } from "react-router-dom";
import { Agent } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AgentCardProps {
  agent: Agent;
  index: number;
}

const AgentCard = ({ agent, index }: AgentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/chat/${agent.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-glow">
          <div
            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-5"
            style={{ background: `linear-gradient(135deg, hsl(${agent.color}), transparent)` }}
          />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl">{agent.icon}</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                {agent.creditCost} crédito{agent.creditCost > 1 ? "s" : ""}
              </span>
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{agent.description}</p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Usar agente <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AgentCard;
