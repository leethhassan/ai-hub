"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { Copy, Download, RotateCcw } from "lucide-react";

const contentTypes = ["مقال", "منشور فيسبوك", "منشور إنستغرام", "وصف منتج", "بريد إلكتروني", "إعلان", "إعادة صياغة", "تلخيص", "أفكار محتوى"];
const tones = ["احترافية", "ودّية", "تسويقية", "رسمية", "مرحة"];

export default function WriterPage() {
  const { show } = useToast();
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [tone, setTone] = useState(tones[0]);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, topic, tone, language, length })
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

  function download() {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-writer-result.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">AI Writer</h1>
      <p className="text-ink-muted mb-8">اكتب محتوى احترافيًا خلال ثوانٍ.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-5 flex flex-col gap-4 h-fit">
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">نوع المحتوى</label>
            <Select value={contentType} onChange={(e) => setContentType(e.target.value)}>
              {contentTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">الموضوع</label>
            <Textarea rows={4} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="اكتب وصفًا مختصرًا للموضوع..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-ink-muted mb-1.5 block">النبرة</label>
              <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                {tones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm text-ink-muted mb-1.5 block">اللغة</label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value as "ar" | "en")}>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">طول النص</label>
            <Select value={length} onChange={(e) => setLength(e.target.value as any)}>
              <option value="short">قصير</option>
              <option value="medium">متوسط</option>
              <option value="long">طويل</option>
            </Select>
          </div>
          <Button onClick={generate} loading={loading} disabled={!topic.trim()}>
            إنشاء
          </Button>
        </Card>

        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-sm text-ink-muted">النتيجة</h2>
            {result && (
              <div className="flex gap-1">
                <button onClick={() => navigator.clipboard.writeText(result)} className="p-1.5 hover:bg-bg-soft rounded-lg" title="نسخ">
                  <Copy className="h-4 w-4 text-ink-muted" />
                </button>
                <button onClick={download} className="p-1.5 hover:bg-bg-soft rounded-lg" title="تنزيل">
                  <Download className="h-4 w-4 text-ink-muted" />
                </button>
                <button onClick={generate} className="p-1.5 hover:bg-bg-soft rounded-lg" title="إعادة التوليد">
                  <RotateCcw className="h-4 w-4 text-ink-muted" />
                </button>
              </div>
            )}
          </div>
          {loading ? (
            <Spinner label="جارٍ الكتابة..." />
          ) : result ? (
            <Textarea value={result} onChange={(e) => setResult(e.target.value)} rows={16} className="text-sm leading-relaxed" />
          ) : (
            <EmptyState title="لا توجد نتيجة بعد" description="املأ النموذج واضغط إنشاء." />
          )}
        </Card>
      </div>
    </div>
  );
}
