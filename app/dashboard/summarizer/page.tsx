"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { Copy, UploadCloud } from "lucide-react";
import { cn } from "@/lib/cn";

const modes = [
  { key: "short", label: "قصير" },
  { key: "medium", label: "متوسط" },
  { key: "detailed", label: "مفصّل" }
] as const;

export default function SummarizerPage() {
  const { show } = useToast();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"short" | "medium" | "detailed">("medium");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const [extracting, setExtracting] = useState(false);

  async function handleFile(file: File) {
    if (!["text/plain", "application/pdf"].includes(file.type)) {
      show("مسموح فقط بملفات PDF أو TXT.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      show("حجم الملف يجب ألا يتجاوز 5 ميغابايت.", "error");
      return;
    }
    setFileName(file.name);

    if (file.type === "text/plain") {
      setText(await file.text());
      return;
    }

    setExtracting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract-text", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        show(data.error || "تعذر استخراج نص الملف.", "error");
        return;
      }
      setText(data.text);
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setExtracting(false);
    }
  }

  async function summarize() {
    if (!text.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode })
      });
      const data = await res.json();
      if (!res.ok) {
        show(data.error || "حدث خطأ.", "error");
        return;
      }
      setResult(data.result);
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">Summarizer</h1>
      <p className="text-ink-muted mb-8">لخّص النصوص والملفات بسرعة ودقة.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-5 flex flex-col gap-4 h-fit">
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl2 py-6 cursor-pointer hover:border-accent/50 transition-colors">
            <UploadCloud className="h-6 w-6 text-ink-muted" />
            <span className="text-sm text-ink-muted">
              {extracting ? "جارٍ استخراج النص..." : fileName || "ارفع ملف PDF أو TXT (حتى 5MB)"}
            </span>
            <input
              type="file"
              accept=".pdf,.txt,text/plain,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>

          <Textarea
            rows={8}
            value={text}
            onChange={(e) => {
              setFileName(null);
              setText(e.target.value);
            }}
            placeholder="أو الصق النص مباشرة هنا..."
          />

          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">نوع الملخص</label>
            <div className="flex gap-2">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={cn(
                    "flex-1 rounded-xl2 border px-3 py-2 text-sm transition-colors",
                    mode === m.key ? "border-accent bg-accent/10 text-accent-soft" : "border-border text-ink-muted"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={summarize} loading={loading} disabled={!text.trim()}>
            تلخيص
          </Button>
        </Card>

        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-sm text-ink-muted">الملخص</h2>
            {result && (
              <button onClick={() => navigator.clipboard.writeText(result)} className="p-1.5 hover:bg-bg-soft rounded-lg">
                <Copy className="h-4 w-4 text-ink-muted" />
              </button>
            )}
          </div>
          {loading ? (
            <Spinner label="جارٍ التلخيص..." />
          ) : result ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
          ) : (
            <EmptyState title="لا يوجد ملخص بعد" description="ارفع ملفًا أو الصق نصًا ثم اضغط تلخيص." />
          )}
        </Card>
      </div>
    </div>
  );
}
