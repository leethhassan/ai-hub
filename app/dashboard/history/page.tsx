import { createClient } from "@/lib/supabase/server";
import { getTodayUsage } from "@/lib/usage";
import { UsageCard } from "@/components/UsageCard";
import { Card } from "@/components/ui/Card";
import { redirect } from "next/navigation";

const toolLabels: Record<string, string> = {
  chat: "AI Chat",
  writer: "AI Writer",
  summarizer: "Summarizer",
  translator: "Translator",
  image: "Image Generator",
  speech: "Speech to Text",
  files: "File Analyzer",
  code: "Code Assistant"
};

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const usage = await getTodayUsage(supabase, user.id);

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false })
    .limit(10);

  const { data: images } = await supabase
    .from("generated_images")
    .select("id, prompt, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">سجل الاستخدام</h1>
      <p className="text-ink-muted mb-8">استخدامك اليوم وآخر أنشطتك.</p>

      <h2 className="font-medium mb-4">استخدام اليوم</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(usage).map(([tool, u]) => (
          <UsageCard key={tool} label={toolLabels[tool] ?? tool} used={u.used} limit={u.limit} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-medium mb-4">آخر المحادثات</h2>
          <Card className="divide-y divide-border">
            {(conversations ?? []).length === 0 ? (
              <p className="p-5 text-sm text-ink-muted">لا توجد محادثات بعد.</p>
            ) : (
              conversations!.map((c) => (
                <div key={c.id} className="p-4 text-sm flex items-center justify-between">
                  <span className="truncate">{c.title}</span>
                  <span className="text-ink-muted text-xs">{new Date(c.updated_at).toLocaleDateString("ar")}</span>
                </div>
              ))
            )}
          </Card>
        </div>

        <div>
          <h2 className="font-medium mb-4">آخر الصور المولّدة</h2>
          <Card className="divide-y divide-border">
            {(images ?? []).length === 0 ? (
              <p className="p-5 text-sm text-ink-muted">لا توجد صور بعد.</p>
            ) : (
              images!.map((img) => (
                <div key={img.id} className="p-4 text-sm flex items-center justify-between">
                  <span className="truncate">{img.prompt}</span>
                  <span className="text-ink-muted text-xs">{new Date(img.created_at).toLocaleDateString("ar")}</span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
