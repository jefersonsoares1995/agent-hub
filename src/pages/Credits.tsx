import { useCreditsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Coins, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const PACKS = [
  { amount: 10, price: "R$ 9,90", popular: false },
  { amount: 30, price: "R$ 24,90", popular: true },
  { amount: 100, price: "R$ 69,90", popular: false },
];

const Credits = () => {
  const { balance, addCredits } = useCreditsStore();

  const handleBuy = (amount: number) => {
    addCredits(amount, "purchase");
    toast.success(`${amount} créditos adicionados!`);
  };

  return (
    <div className="relative container max-w-2xl py-10">
      <div className="fixed inset-0 futuristic-grid opacity-20 pointer-events-none" />

      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary"
          animate={{ boxShadow: [
            "0 0 20px hsl(172 66% 50% / 0.15)",
            "0 0 50px hsl(172 66% 50% / 0.3)",
            "0 0 20px hsl(172 66% 50% / 0.15)",
          ]}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Coins className="h-8 w-8 text-primary-foreground" />
        </motion.div>
        <h1 className="font-heading text-3xl font-bold text-gradient-primary">Créditos</h1>
        <p className="mt-2 text-muted-foreground">
          Saldo atual:{" "}
          <span className={balance > 0 ? "text-credit-positive font-semibold" : "text-credit-zero font-semibold"}>
            {balance} créditos
          </span>
        </p>
      </motion.div>

      <div className="relative grid gap-4 sm:grid-cols-3">
        {PACKS.map((pack, i) => (
          <motion.div
            key={pack.amount}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`relative rounded-xl border p-6 text-center transition-all duration-300 ${
              pack.popular
                ? "border-primary/50 shadow-glow bg-card"
                : "border-border bg-card hover:border-primary/30 hover:shadow-glow"
            }`}
          >
            {pack.popular && (
              <motion.span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-3 w-3" /> Popular
              </motion.span>
            )}
            <p className="font-heading text-3xl font-bold text-foreground">{pack.amount}</p>
            <p className="text-sm text-muted-foreground">créditos</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{pack.price}</p>
            <Button
              onClick={() => handleBuy(pack.amount)}
              className="mt-4 w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all hover:shadow-glow"
            >
              <Plus className="h-4 w-4 mr-1" /> Comprar
            </Button>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Pagamento mockado — integração real com Stripe será adicionada depois.
      </p>
    </div>
  );
};

export default Credits;
