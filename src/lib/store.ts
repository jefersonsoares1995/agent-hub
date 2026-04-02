import { create } from "zustand";
import { Agent, ChatMessage, CreditTransaction, User } from "./types";
import { MOCK_AGENTS, MOCK_BALANCE, MOCK_TRANSACTIONS } from "./mock";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  setSession: (session) => set({ session, isAuthenticated: !!session }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  signup: async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  },
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/agentes",
      },
    });
    if (error) throw error;
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },
  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) {
      set({
        user: {
          id: data.user_id,
          email: data.email ?? "",
          displayName: data.display_name ?? "",
          avatarUrl: data.avatar_url ?? undefined,
        },
      });
    }
  },
}));

// Credits store
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

// Chat store
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

// Agents store
interface AgentsState {
  agents: Agent[];
  getAgent: (id: string) => Agent | undefined;
}

export const useAgentsStore = create<AgentsState>(() => ({
  agents: MOCK_AGENTS,
  getAgent: (id) => MOCK_AGENTS.find((a) => a.id === id),
}));

// Theme store
interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("app-theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      return saved;
    }
  }
  return "cyber";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
    set({ theme });
  },
}));
