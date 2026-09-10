export type ToolKey =
  | "chat"
  | "writer"
  | "summarizer"
  | "translator"
  | "image"
  | "speech"
  | "files"
  | "code";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  plan: "free" | "pro" | "business";
  role: "user" | "admin";
  created_at: string;
}

export interface UsageRow {
  id: string;
  user_id: string;
  tool: ToolKey;
  day: string; // YYYY-MM-DD
  count: number;
}

export const DAILY_LIMITS: Record<ToolKey, number> = {
  chat: 20,
  writer: 5,
  summarizer: 5,
  translator: 5,
  image: 5,
  speech: 5,
  files: 2,
  code: 10
};

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
