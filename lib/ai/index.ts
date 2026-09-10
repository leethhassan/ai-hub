import { openaiProvider } from "./providers/openai";

export interface ChatMessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProvider {
  /** Non-streaming chat completion. Returns the full text. */
  chat(messages: ChatMessageInput[], opts?: { temperature?: number }): Promise<string>;
  /** Streaming chat completion. Yields text chunks. */
  chatStream(
    messages: ChatMessageInput[],
    opts?: { temperature?: number }
  ): AsyncGenerator<string, void, unknown>;
  /** Text-to-image generation. Returns an image URL. */
  generateImage(prompt: string, opts?: { size?: string; style?: string }): Promise<string>;
  /** Audio transcription. Takes a File/Blob, returns text. */
  transcribe(file: Blob, filename: string): Promise<string>;
}

/**
 * Provider registry. Add a new provider by implementing the AIProvider
 * interface in lib/ai/providers/<name>.ts and registering it here.
 * Switch providers by setting AI_PROVIDER in your environment — no
 * application code needs to change.
 */
const providers: Record<string, AIProvider> = {
  openai: openaiProvider
};

export function getAIProvider(): AIProvider {
  const key = process.env.AI_PROVIDER || "openai";
  const provider = providers[key];
  if (!provider) {
    throw new Error(`مزود الذكاء الاصطناعي غير مدعوم: ${key}`);
  }
  return provider;
}
