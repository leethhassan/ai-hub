"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner, EmptyState } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import { UploadCloud, Copy, Download } from "lucide-react";

export default function SpeechPage() {
  const { show } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    if (file.size > 20 * 1024 * 1024) {
      show("حجم الملف يجب ألا يتجاوز 20 ميغابايت.", "error");
      return;
    }
    setFileName(file.name);
    setText("");

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      setDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        show(data.error || "حدث خطأ.", "error");
        return;
      }
      setText(data.text);
    } catch {
      show("تعذر الاتصال بالخادم.", "error");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">Speech to Text</h1>
      <p className="text-ink-muted mb-8">حوّل الملفات الصوتية إلى نص مكتوب بدقة.</p>

      <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl2 py-16 cursor-pointer hover:border-accent/50 transition-colors mb-6">
        <UploadCloud className="h-8 w-8 text-ink-muted" />
        <span className="text-sm text-ink-muted">{fileName || "اضغط لاختيار ملف صوتي (حتى 20MB)"}</span>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label>

      {fileName && (
        <Card className="p-4 mb-4 flex items-center justify-between text-sm">
          <span className="text-ink-muted">مدة الملف: {duration ?? "..."}</span>
          <span className="text-ink-muted">{loading ? "جارٍ المعالجة..." : "تمت المعالجة"}</span>
        </Card>
      )}

      <Card className="p-5">
        {loading ? (
          <Spinner label="جارٍ تحويل الصوت إلى نص..." />
        ) : text ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigator.clipboard.writeText(text)}><Copy className="h-4 w-4" /> نسخ</Button>
              <Button variant="secondary" onClick={download}><Download className="h-4 w-4" /> تنزيل TXT</Button>
            </div>
          </div>
        ) : (
          <EmptyState title="لا يوجد نص بعد" description="ارفع ملفًا صوتيًا للبدء." />
        )}
      </Card>
    </div>
  );
}
