import { create } from "zustand";
import { Agent, ChatMessage, CreditTransaction, User } from "./types";
import { MOCK_AGENTS, MOCK_BALANCE, MOCK_TRANSACTIONS, MOCK_USER } from "./mock";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (_email, _password) => {
    await new Promise((r) => setTimeout(r, 600));
    set({ user: MOCK_USER, isAuthenticated: true });
  },
  signup: async (_email, _password, name) => {
    await new Promise((r) => setTimeout(r, 600));
    set({ user: { ...MOCK_USER, displayName: name }, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface CreditsState {
  balance: number;
  transactions: CreditTransaction[];
  deduct: (amount: number, description: string) => void;
  addCredits: (amount: number, reason: "purchase" | "bonus") => void;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  balance: MOCK_BALANCE,
  transactions: MOCK_TRANSACTIONS,
  deduct: (amount, description) =>
    set((s) => ({
      balance: s.balance - amount,
      transactions: [
        { id: `tx-${Date.now()}`, amount: -amount, reason: "usage", description, createdAt: new Date() },
        ...s.transactions,
      ],
    })),
  addCredits: (amount, reason) =>
    set((s) => ({
      balance: s.balance + amount,
      transactions: [
        { id: `tx-${Date.now()}`, amount, reason, description: reason === "purchase" ? "Compra de créditos" : "Bônus", createdAt: new Date() },
        ...s.transactions,
      ],
    })),
}));

interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
  addMessage: (msg: ChatMessage) => void;
  setGenerating: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isGenerating: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setGenerating: (v) => set({ isGenerating: v }),
  clearMessages: () => set({ messages: [] }),
}));

interface AgentsState {
  agents: Agent[];
  getAgent: (id: string) => Agent | undefined;
}

export const useAgentsStore = create<AgentsState>(() => ({
  agents: MOCK_AGENTS,
  getAgent: (id) => MOCK_AGENTS.find((a) => a.id === id),
}));
