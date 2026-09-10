"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { Download, RotateCcw, Copy } from "lucide-react";

const styles = ["واقعي", "فني", "كرتوني", "خيال علمي", "مائي", "بدون أسلوب محدد"];
const ratios = [
  { key: "1024x1024", label: "مربع" },
  { key: "1792x1024", label: "عريض" },
  { key: "1024x1792", label: "طولي" }
] as const;

export default function ImageGeneratorPage() {
  const { show } = useToast();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [ratio, setRatio] = useState<typeof ratios[number]["key"]>("1024x1024");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setUrl("");
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, aspectRatio: ratio })
      });
      const data = await res.json();
      if (!res.ok) {
        show(data.error || "حدث خطأ.", "error");
        return;
      }
      setUrl(data.url);
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">Image Generator</h1>
      <p className="text-ink-muted mb-8">حوّل وصفك النصي إلى صورة فريدة.</p>

      <Card className="p-5 flex flex-col gap-4 mb-6">
        <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="صِف الصورة التي تريدها بالتفصيل..." />
        <div className="grid grid-cols-2 gap-3">
          <Select value={style} onChange={(e) => setStyle(e.target.value)}>
            {styles.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select value={ratio} onChange={(e) => setRatio(e.target.value as any)}>
            {ratios.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </Select>
        </div>
        <Button onClick={generate} loading={loading} disabled={!prompt.trim()}>
          Generate Image
        </Button>
      </Card>

      <Card className="p-5">
        {loading ? (
          <Spinner label="جارٍ توليد الصورة..." />
        ) : url ? (
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={prompt} className="rounded-xl2 w-full border border-border" />
            <div className="flex gap-2">
              <a href={url} download target="_blank" rel="noreferrer" className="flex-1">
                <Button variant="secondary" className="w-full"><Download className="h-4 w-4" /> تنزيل</Button>
              </a>
              <Button variant="secondary" onClick={() => navigator.clipboard.writeText(prompt)}><Copy className="h-4 w-4" /></Button>
              <Button variant="secondary" onClick={generate}><RotateCcw className="h-4 w-4" /></Button>
            </div>
          </div>
        ) : (
          <EmptyState title="لا توجد صورة بعد" description="اكتب وصفًا واضغط Generate Image." />
        )}
      </Card>
    </div>
  );
}
