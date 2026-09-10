"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChatMessage } from "@/components/ChatMessage";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { Plus, Send, Trash2, Pencil, MessageSquare, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Conversation, Message } from "@/types";

export default function ChatPage() {
  const supabase = createClient();
  const { show } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function loadConversations() {
    setLoadingConvs(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    setConversations(data ?? []);
    setLoadingConvs(false);
  }

  async function openConversation(id: string) {
    setActiveId(id);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
  }

  function startNewChat() {
    setActiveId(null);
    setMessages([]);
  }

  async function deleteConversation(id: string) {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) startNewChat();
    show("تم حذف المحادثة");
  }

  async function renameConversation(id: string) {
    const title = prompt("اسم جديد للمحادثة");
    if (!title) return;
    await supabase.from("conversations").update({ title }).eq("id", id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");
    setStreamingText("");

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: activeId ?? "",
      role: "user",
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId ?? undefined, message: text })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        show(data.error || "حدث خطأ. حاول مرة أخرى.", "error");
        setSending(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let convId = activeId;
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        let chunk = decoder.decode(value, { stream: true });

        if (firstChunk) {
          const match = chunk.match(/^__CONV__(.+?)__\n/);
          if (match) {
            convId = match[1];
            chunk = chunk.slice(match[0].length);
            if (!activeId) {
              setActiveId(convId);
              loadConversations();
            }
          }
          firstChunk = false;
        }

        acc += chunk;
        setStreamingText(acc);
      }

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, conversation_id: convId ?? "", role: "assistant", content: acc, created_at: new Date().toISOString() }
      ]);
      setStreamingText("");
      loadConversations();
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setSending(false);
    }
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) sendMessage(lastUser.content);
  }

  return (
    <div className="flex h-screen">
      {/* Conversation list */}
      <div className="hidden lg:flex w-72 shrink-0 flex-col border-l border-border/60">
        <div className="p-3 border-b border-border/60">
          <Button variant="secondary" className="w-full" onClick={startNewChat}>
            <Plus className="h-4 w-4" /> محادثة جديدة
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loadingConvs ? (
            <Spinner />
          ) : conversations.length === 0 ? (
            <EmptyState title="لا توجد محادثات بعد" />
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "group flex items-center gap-2 rounded-xl2 px-3 py-2.5 text-sm cursor-pointer mb-1",
                  activeId === c.id ? "bg-accent/15 text-accent-soft" : "hover:bg-bg-card text-ink-muted"
                )}
                onClick={() => openConversation(c.id)}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate">{c.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    renameConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto py-6">
            {messages.length === 0 && !streamingText && (
              <EmptyState title="ابدأ محادثة جديدة" description="اكتب رسالتك في الأسفل للبدء." />
            )}
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role} content={m.content} />
            ))}
            {streamingText && <ChatMessage role="assistant" content={streamingText} />}
            {sending && !streamingText && <Spinner label="جارٍ الكتابة..." />}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-border/60 p-4">
          <div className="max-w-2xl mx-auto">
            {messages.some((m) => m.role === "assistant") && !sending && (
              <button
                onClick={regenerate}
                className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink mb-2"
              >
                <RotateCcw className="h-3 w-3" /> إعادة توليد آخر رد
              </button>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="اكتب رسالتك هنا..."
                rows={2}
                className="flex-1"
              />
              <Button type="submit" loading={sending} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
