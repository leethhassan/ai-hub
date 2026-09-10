"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { UploadCloud, Send, FileText } from "lucide-react";

const suggestions = ["لخص هذا الملف", "ما أهم النقاط؟", "استخرج الأرقام المهمة", "أنشئ جدولًا بالمعلومات"];

interface Turn { question: string; answer: string; }

export default function FilesPage() {
  const { show } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileText, setFileText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);

  async function handleFile(file: File) {
    const allowed = ["application/pdf", "text/plain", "text/csv"];
    if (!allowed.includes(file.type)) {
      show("مسموح فقط بملفات PDF أو TXT أو CSV.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      show("حجم الملف يجب ألا يتجاوز 5 ميغابايت.", "error");
      return;
    }
    setFileName(file.name);
    setTurns([]);

    if (file.type !== "application/pdf") {
      setFileText(await file.text());
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
      setFileText(data.text);
    } finally {
      setExtracting(false);
    }
  }

  async function ask(q?: string) {
    const text = (q ?? question).trim();
    if (!text || !fileText) return;
    setAsking(true);
    setQuestion("");
    try {
      const res = await fetch("/api/file-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileText, fileName, question: text })
      });
      const data = await res.json();
      if (!res.ok) {
        show(data.error || "حدث خطأ.", "error");
        return;
      }
      setTurns((prev) => [...prev, { question: text, answer: data.result }]);
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">File Analyzer</h1>
      <p className="text-ink-muted mb-8">ارفع ملفًا واسأل الذكاء الاصطناعي عن محتواه.</p>

      {!fileText ? (
        <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl2 py-16 cursor-pointer hover:border-accent/50 transition-colors">
          <UploadCloud className="h-8 w-8 text-ink-muted" />
          <span className="text-sm text-ink-muted">
            {extracting ? "جارٍ استخراج النص..." : "اسحب ملفًا هنا أو اضغط للاختيار (PDF, TXT, CSV — حتى 5MB)"}
          </span>
          <input
            type="file"
            accept=".pdf,.txt,.csv,application/pdf,text/plain,text/csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      ) : (
        <>
          <Card className="p-4 flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-accent-soft shrink-0" />
            <span className="text-sm flex-1 truncate">{fileName}</span>
            <Button variant="ghost" size="sm" onClick={() => { setFileText(""); setFileName(null); setTurns([]); }}>
              إزالة
            </Button>
          </Card>

          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                disabled={asking}
                className="text-xs rounded-full border border-border px-3 py-1.5 text-ink-muted hover:border-accent/50 hover:text-ink transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <Card className="p-5 mb-4 min-h-[200px]">
            {turns.length === 0 && !asking ? (
              <EmptyState title="اسأل عن الملف" description="اختر سؤالًا جاهزًا أو اكتب سؤالك في الأسفل." />
            ) : (
              <div className="flex flex-col gap-5">
                {turns.map((t, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-accent-soft mb-1.5">{t.question}</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{t.answer}</p>
                  </div>
                ))}
                {asking && <Spinner label="جارٍ التحليل..." />}
              </div>
            )}
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="flex gap-2"
          >
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="اكتب سؤالك عن الملف..." />
            <Button type="submit" loading={asking} disabled={!question.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
