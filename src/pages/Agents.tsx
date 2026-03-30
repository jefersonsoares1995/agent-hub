import { useAgentsStore } from "@/lib/store";
import AgentCard from "@/components/AgentCard";

const Agents = () => {
  const { agents } = useAgentsStore();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Agentes</h1>
        <p className="mt-2 text-muted-foreground">Escolha um agente de IA para começar</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {agents.filter((a) => a.active).map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Agents;
