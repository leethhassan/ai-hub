import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, User, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

export function ChatMessage({
  role,
  content
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3 py-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-8 w-8 shrink-0 rounded-xl2 flex items-center justify-center",
          isUser ? "bg-bg-card border border-border" : "bg-accent/15 text-accent-soft"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "group relative max-w-[85%] rounded-xl2 px-4 py-3 text-sm leading-relaxed prose-chat",
          isUser ? "bg-accent text-white" : "bg-bg-card border border-border text-ink"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        <button
          onClick={() => navigator.clipboard.writeText(content)}
          className="absolute -bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-soft border border-border rounded-lg p-1"
          aria-label="نسخ"
        >
          <Copy className="h-3 w-3 text-ink-muted" />
        </button>
      </div>
    </div>
  );
}
