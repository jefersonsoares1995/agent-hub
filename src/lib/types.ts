export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  creditCost: number;
  active: boolean;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  agentId: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  reason: "purchase" | "usage" | "bonus";
  description: string;
  createdAt: Date;
}
