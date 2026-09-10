"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { ArrowLeftRight, Copy, X } from "lucide-react";

const languages = [
  { code: "Arabic", label: "العربية" },
  { code: "English", label: "الإنجليزية" },
  { code: "French", label: "الفرنسية" },
  { code: "German", label: "الألمانية" },
  { code: "Spanish", label: "الإسبانية" },
  { code: "Turkish", label: "التركية" },
  { code: "Italian", label: "الإيطالية" },
  { code: "Japanese", label: "اليابانية" },
  { code: "Chinese", label: "الصينية" }
];

export default function TranslatorPage() {
  const { show } = useToast();
  const [from, setFrom] = useState("Arabic");
  const [to, setTo] = useState("English");
  const [source, setSource] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);

  async function translate() {
    if (!source.trim()) return;
    setLoading(true);
    setTranslated("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: source, from, to })
      });
      const data = await res.json();
      if (!res.ok) {
        show(data.error || "حدث خطأ.", "error");
        return;
      }
      setTranslated(data.result);
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setFrom(to);
    setTo(from);
    setSource(translated);
    setTranslated(source);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">Translator</h1>
      <p className="text-ink-muted mb-8">ترجم بين تسع لغات بدقة عالية.</p>

      <div className="flex items-center gap-3 mb-4">
        <Select value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1">
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </Select>
        <button onClick={swap} className="p-2.5 rounded-xl2 border border-border hover:border-accent/50 shrink-0" title="تبديل اللغتين">
          <ArrowLeftRight className="h-4 w-4 text-ink-muted" />
        </button>
        <Select value={to} onChange={(e) => setTo(e.target.value)} className="flex-1">
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Textarea rows={10} value={source} onChange={(e) => setSource(e.target.value)} placeholder="اكتب النص هنا..." />
          {source && (
            <button onClick={() => setSource("")} className="absolute top-3 left-3 p-1 hover:bg-bg-soft rounded-lg">
              <X className="h-3.5 w-3.5 text-ink-muted" />
            </button>
          )}
        </div>
        <div className="relative rounded-xl2 border border-border bg-bg-soft p-4 text-sm leading-relaxed">
          {loading ? (
            <Spinner label="جارٍ الترجمة..." />
          ) : translated ? (
            <>
              <p className="whitespace-pre-wrap pl-6">{translated}</p>
              <button
                onClick={() => navigator.clipboard.writeText(translated)}
                className="absolute top-3 left-3 p-1 hover:bg-bg-card rounded-lg"
              >
                <Copy className="h-3.5 w-3.5 text-ink-muted" />
              </button>
            </>
          ) : (
            <p className="text-ink-muted">ستظهر الترجمة هنا...</p>
          )}
        </div>
      </div>

      <Button onClick={translate} loading={loading} disabled={!source.trim()} className="mt-4 w-full md:w-auto">
        ترجمة
      </Button>
    </div>
  );
}
