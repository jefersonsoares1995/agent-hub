import { useAuthStore, useCreditsStore } from "@/lib/store";
import { Coins, User } from "lucide-react";
import { format } from "date-fns";
import EditProfileModal from "@/components/EditProfileModal";

const Account = () => {
  const { user } = useAuthStore();
  const { balance, transactions } = useCreditsStore();

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Minha Conta</h1>

      {/* Profile card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">{user?.displayName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
          <Coins className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Saldo:</span>
          <span className={`font-semibold ${balance > 0 ? "text-credit-positive" : "text-credit-zero"}`}>
            {balance} créditos
          </span>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Histórico</h2>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{format(tx.createdAt, "dd/MM/yyyy")}</p>
              </div>
              <span className={`text-sm font-semibold ${tx.amount > 0 ? "text-credit-positive" : "text-credit-zero"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
