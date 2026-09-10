"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";

const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "HTML", "CSS", "SQL", "PHP"];
const actions = [
  { key: "explain", label: "شرح الكود" },
  { key: "fix", label: "إصلاح الكود" },
  { key: "optimize", label: "تحسين الكود" },
  { key: "generate", label: "توليد كود" },
  { key: "convert", label: "تحويل اللغة" }
] as const;

export default function CodeAssistantPage() {
  const { show } = useToast();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[1]);
  const [action, setAction] = useState<typeof actions[number]["key"]>("explain");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!code.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, targetLanguage: action === "convert" ? targetLanguage : undefined, action })
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
      <h1 className="text-2xl font-bold mb-1">Code Assistant</h1>
      <p className="text-ink-muted mb-8">اشرح، أصلح، حسّن، ولّد كودًا بلغات متعددة.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-5 flex flex-col gap-4 h-fit">
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button
                key={a.key}
                onClick={() => setAction(a.key)}
                className={`text-xs rounded-full border px-3 py-1.5 transition-colors ${
                  action === a.key ? "border-accent bg-accent/10 text-accent-soft" : "border-border text-ink-muted"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-ink-muted mb-1.5 block">اللغة</label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((l) => <option key={l}>{l}</option>)}
              </Select>
            </div>
            {action === "convert" && (
              <div>
                <label className="text-sm text-ink-muted mb-1.5 block">تحويل إلى</label>
                <Select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                  {languages.map((l) => <option key={l}>{l}</option>)}
                </Select>
              </div>
            )}
          </div>

          <Textarea rows={12} value={code} onChange={(e) => setCode(e.target.value)} placeholder="الصق الكود هنا، أو صف ما تريد توليده..." className="font-mono text-xs" dir="ltr" />

          <Button onClick={run} loading={loading} disabled={!code.trim()}>
            تنفيذ
          </Button>
        </Card>

        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-sm text-ink-muted">النتيجة</h2>
            {result && (
              <button onClick={() => navigator.clipboard.writeText(result)} className="p-1.5 hover:bg-bg-soft rounded-lg">
                <Copy className="h-4 w-4 text-ink-muted" />
              </button>
            )}
          </div>
          {loading ? (
            <Spinner label="جارٍ التنفيذ..." />
          ) : result ? (
            <div className="prose-chat text-sm overflow-x-auto">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <EmptyState title="لا توجد نتيجة بعد" description="الصق كودًا واختر إجراءً." />
          )}
        </Card>
      </div>
    </div>
  );
}
