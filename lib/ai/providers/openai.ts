import type { AIProvider, ChatMessageInput } from "../index";

const BASE_URL = "https://api.openai.com/v1";

function requireKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY غير مُعرّف في متغيرات البيئة");
  return key;
}

async function chat(messages: ChatMessageInput[], opts?: { temperature?: number }) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      messages,
      temperature: opts?.temperature ?? 0.7
    })
  });

  if (!res.ok) {
    throw new Error(`فشل استدعاء نموذج الذكاء الاصطناعي (${res.status})`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function* chatStream(messages: ChatMessageInput[], opts?: { temperature?: number }) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      messages,
      temperature: opts?.temperature ?? 0.7,
      stream: true
    })
  });

  if (!res.ok || !res.body) {
    throw new Error(`فشل استدعاء نموذج الذكاء الاصطناعي (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta as string;
      } catch {
        // Skip malformed SSE chunk
      }
    }
  }
}

async function generateImage(prompt: string, opts?: { size?: string; style?: string }) {
  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "dall-e-3",
      prompt,
      size: opts?.size || "1024x1024",
      n: 1
    })
  });

  if (!res.ok) {
    throw new Error(`فشل توليد الصورة (${res.status})`);
  }

  const data = await res.json();
  return data.data?.[0]?.url ?? "";
}

async function transcribe(file: Blob, filename: string) {
  const form = new FormData();
  form.append("file", file, filename);
  form.append("model", process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1");

  const res = await fetch(`${BASE_URL}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${requireKey()}` },
    body: form
  });

  if (!res.ok) {
    throw new Error(`فشل تحويل الصوت إلى نص (${res.status})`);
  }

  const data = await res.json();
  return data.text ?? "";
}

export const openaiProvider: AIProvider = {
  chat,
  chatStream,
  generateImage,
  transcribe
};
