import { Link } from "react-router-dom";
import { Agent } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface AgentCardProps {
  agent: Agent;
  index: number;
}

const AgentCard = ({ agent, index }: AgentCardProps) => {
  const IconComponent = (LucideIcons as any)[agent.icon] as React.ElementType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/chat/${agent.id}`} className="block h-full">
        <div className="group relative h-full flex flex-col overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/50 p-6 pb-10 backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          {/* Badge de Crédito Discreto */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-white/5 bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-400 backdrop-blur-md">
            {agent.creditCost} crédito{agent.creditCost > 1 ? "s" : ""}
          </div>

          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-10"
            style={{ background: `linear-gradient(135deg, hsl(${agent.color}), transparent 70%)` }}
          />

          {/* Scan line effect on hover */}
          <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 pointer-events-none overflow-hidden group-hover:opacity-100">
            <motion.div
              className="absolute left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, hsl(${agent.color} / 0.5), transparent)` }}
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
              <motion.div
                className="flex items-center justify-center rounded-lg bg-cyan-500/10 p-3"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                {IconComponent ? (
                  <IconComponent className="h-6 w-6 text-cyan-400/80" />
                ) : (
                  <span className="text-3xl">{agent.icon}</span>
                )}
              </motion.div>
              
              <div className="flex flex-col items-end gap-1.5 mt-2">
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-cyan-400">
                  {agent.category}
                </span>
              </div>
            </div>
            
            <h3 className="mb-2 font-heading text-lg font-bold text-slate-100">{agent.name}</h3>
            <p className="mb-4 flex-grow text-sm leading-relaxed text-slate-300">{agent.description}</p>
            
            <div className="mt-auto flex w-fit items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-cyan-400 opacity-0 transition-all duration-300 hover:bg-cyan-500/10 group-hover:opacity-100">
              Usar agente <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AgentCard;
