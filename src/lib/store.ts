import { create } from "zustand";
import { Agent, ChatMessage, CreditTransaction, User } from "./types";
import { MOCK_AGENTS } from "./mock";
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

// Credits store — backed by Supabase
interface CreditsState {
  balance: number;
  transactions: CreditTransaction[];
  loading: boolean;
  fetchCredits: (userId: string) => Promise<void>;
  deduct: (amount: number, description: string) => Promise<void>;
  addCredits: (amount: number, reason: "purchase" | "bonus") => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
  balance: 0,
  transactions: [],
  loading: true,
  fetchCredits: async (userId: string) => {
    const [balanceRes, txRes] = await Promise.all([
      supabase.from("credit_balances").select("balance").eq("user_id", userId).single(),
      supabase.from("credit_transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
    ]);
    set({
      balance: balanceRes.data?.balance ?? 0,
      transactions: (txRes.data ?? []).map((t: any) => ({
        id: t.id,
        amount: t.amount,
        reason: t.reason,
        description: t.description ?? "",
        createdAt: new Date(t.created_at),
      })),
      loading: false,
    });
  },
  deduct: async (amount, description) => {
    const { data, error } = await supabase.rpc("deduct_credits", {
      p_amount: amount,
      p_description: description,
    });
    if (error || !data?.success) {
      console.error("deduct_credits failed:", error || data?.error);
      return;
    }
    set((s) => ({
      balance: data.new_balance,
      transactions: [
        { id: data.transaction_id, amount: -amount, reason: "usage", description, createdAt: new Date() },
        ...s.transactions,
      ],
    }));
  },
  addCredits: async (amount, reason) => {
    const desc = reason === "purchase" ? "Compra de créditos" : "Bônus";
    const { data, error } = await supabase.rpc("add_credits", {
      p_amount: amount,
      p_reason: reason,
      p_description: desc,
    });
    if (error || !data?.success) {
      console.error("add_credits failed:", error || data?.error);
      return;
    }
    set((s) => ({
      balance: data.new_balance,
      transactions: [
        { id: crypto.randomUUID(), amount, reason, description: desc, createdAt: new Date() },
        ...s.transactions,
      ],
    }));
  },
}));

// Chat store — backed by Supabase
interface ChatState {
  sessionId: string | null;
  messages: ChatMessage[];
  isGenerating: boolean;
  loadingHistory: boolean;
  initSession: (agentId: string) => Promise<void>;
  addMessage: (msg: ChatMessage) => void;
  persistMessage: (msg: ChatMessage) => Promise<void>;
  setGenerating: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessionId: null,
  messages: [],
  isGenerating: false,
  loadingHistory: false,
  initSession: async (agentId: string) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;
    const userId = session.user.id;

    set({ loadingHistory: true });

    // Find existing session or create new one
    const { data: existing } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("user_id", userId)
      .eq("agent_id", agentId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    let sessionId: string;
    if (existing) {
      sessionId = existing.id;
      // Load existing messages
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      set({
        sessionId,
        messages: (msgs ?? []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: new Date(m.created_at),
        })),
        loadingHistory: false,
      });
    } else {
      const { data: newSession } = await supabase
        .from("chat_sessions")
        .insert({ user_id: userId, agent_id: agentId })
        .select()
        .single();
      sessionId = newSession?.id ?? "";
      set({ sessionId, messages: [], loadingHistory: false });
    }
  },
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  persistMessage: async (msg: ChatMessage) => {
    const { sessionId } = get();
    const session = (await supabase.auth.getSession()).data.session;
    if (!sessionId || !session) return;

    await supabase.from("chat_messages").insert({
      id: msg.id,
      session_id: sessionId,
      user_id: session.user.id,
      role: msg.role,
      content: msg.content,
    });
    // Touch session updated_at
    await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);
  },
  setGenerating: (v) => set({ isGenerating: v }),
  clearMessages: () => set({ messages: [], sessionId: null }),
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
