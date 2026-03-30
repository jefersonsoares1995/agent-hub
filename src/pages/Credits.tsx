import { useCreditsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";
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
    <div className="container max-w-2xl py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
          <Coins className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Créditos</h1>
        <p className="mt-2 text-muted-foreground">
          Saldo atual:{" "}
          <span className={balance > 0 ? "text-credit-positive font-semibold" : "text-credit-zero font-semibold"}>
            {balance} créditos
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PACKS.map((pack, i) => (
          <motion.div
            key={pack.amount}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-xl border p-6 text-center transition-all ${
              pack.popular
                ? "border-primary shadow-glow bg-card"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                Popular
              </span>
            )}
            <p className="font-heading text-3xl font-bold text-foreground">{pack.amount}</p>
            <p className="text-sm text-muted-foreground">créditos</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{pack.price}</p>
            <Button
              onClick={() => handleBuy(pack.amount)}
              className="mt-4 w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
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
