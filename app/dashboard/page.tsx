import { createClient } from "@/lib/supabase/server";
import { getTodayUsage } from "@/lib/usage";
import { UsageCard } from "@/components/UsageCard";
import { Card } from "@/components/ui/Card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, PenLine, Languages, FolderOpen } from "lucide-react";

const toolLabels: Record<string, string> = {
  chat: "محادثات AI Chat",
  writer: "عمليات الكتابة",
  summarizer: "عمليات التلخيص",
  translator: "الترجمات",
  image: "الصور المولّدة",
  speech: "تحويل الصوت",
  files: "تحليل الملفات",
  code: "مساعد البرمجة"
};

export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .maybeSingle();

  const usage = await getTodayUsage(supabase, user.id);

  const { count: conversationCount } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: fileCount } = await supabase
    .from("uploaded_files")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">مرحبًا بك 👋</h1>
      <p className="text-ink-muted mb-8">
        {profile?.name || profile?.email} — إليك ملخص نشاطك اليوم.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{conversationCount ?? 0}</p>
            <p className="text-sm text-ink-muted">إجمالي المحادثات</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{fileCount ?? 0}</p>
            <p className="text-sm text-ink-muted">ملفات تم تحليلها</p>
          </div>
        </Card>
      </div>

      <h2 className="font-medium mb-4">استخدامك اليوم</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(usage).map(([tool, u]) => (
          <UsageCard key={tool} label={toolLabels[tool] ?? tool} used={u.used} limit={u.limit} />
        ))}
      </div>

      <h2 className="font-medium mb-4">الوصول السريع</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/chat" className="text-sm">
          <Card className="p-4 hover:border-accent/50 transition-colors flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-accent-soft" /> AI Chat
          </Card>
        </Link>
        <Link href="/dashboard/writer" className="text-sm">
          <Card className="p-4 hover:border-accent/50 transition-colors flex items-center gap-3">
            <PenLine className="h-4 w-4 text-accent-soft" /> AI Writer
          </Card>
        </Link>
        <Link href="/dashboard/translator" className="text-sm">
          <Card className="p-4 hover:border-accent/50 transition-colors flex items-center gap-3">
            <Languages className="h-4 w-4 text-accent-soft" /> Translator
          </Card>
        </Link>
        <Link href="/dashboard/files" className="text-sm">
          <Card className="p-4 hover:border-accent/50 transition-colors flex items-center gap-3">
            <FolderOpen className="h-4 w-4 text-accent-soft" /> File Analyzer
          </Card>
        </Link>
      </div>
    </div>
  );
}
