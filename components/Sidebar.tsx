"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  PenLine,
  FileText,
  Languages,
  ImageIcon,
  Mic,
  FolderOpen,
  Code2,
  History,
  Settings,
  LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/writer", label: "الكتابة", icon: PenLine },
  { href: "/dashboard/summarizer", label: "التلخيص", icon: FileText },
  { href: "/dashboard/translator", label: "الترجمة", icon: Languages },
  { href: "/dashboard/image-generator", label: "توليد الصور", icon: ImageIcon },
  { href: "/dashboard/speech", label: "تحويل الصوت", icon: Mic },
  { href: "/dashboard/files", label: "تحليل الملفات", icon: FolderOpen },
  { href: "/dashboard/code", label: "مساعد البرمجة", icon: Code2 },
  { href: "/dashboard/history", label: "سجل الاستخدام", icon: History },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-l border-border/60 h-screen sticky top-0 bg-bg-soft/40">
      <div className="h-16 flex items-center px-5 font-bold border-b border-border/60">
        AI Hub
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm transition-colors",
                active ? "bg-accent/15 text-accent-soft" : "text-ink-muted hover:bg-bg-card hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/60">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm text-ink-muted hover:bg-bg-card hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
