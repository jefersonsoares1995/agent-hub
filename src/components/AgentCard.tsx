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
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link to={`/chat/${agent.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow">
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
            style={{ background: `linear-gradient(135deg, hsl(${agent.color}), transparent 70%)` }}
          />

          {/* Scan line effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, hsl(${agent.color} / 0.5), transparent)` }}
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <motion.span
                className="text-3xl"
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                {agent.icon}
              </motion.span>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `hsl(${agent.color} / 0.15)`, color: `hsl(${agent.color})` }}
                >
                  {agent.category}
                </span>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  {agent.creditCost} crédito{agent.creditCost > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{agent.description}</p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
              Usar agente <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AgentCard;
