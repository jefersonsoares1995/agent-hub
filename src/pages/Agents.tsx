import { useAgentsStore } from "@/lib/store";
import AgentCard from "@/components/AgentCard";
import { motion } from "framer-motion";

const Agents = () => {
  const { agents } = useAgentsStore();

  return (
    <div className="relative container py-10">
      {/* Subtle grid */}
      <div className="fixed inset-0 futuristic-grid opacity-30 pointer-events-none" />

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-3xl font-extrabold tracking-tighter text-foreground">
          <span className="text-gradient-primary">Agentes</span>
        </h1>
        <div className="cyber-line mt-2 pb-2">
          <p className="text-muted-foreground">Escolha um agente de IA para começar</p>
        </div>
      </motion.div>

      <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {agents.filter((a) => a.active).map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Agents;
