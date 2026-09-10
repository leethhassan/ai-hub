"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

const links = [
  { href: "/#tools", label: "الأدوات" },
  { href: "/#pricing", label: "الأسعار" },
  { href: "/faq", label: "الأسئلة الشائعة" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="h-8 w-8 rounded-xl2 bg-accent/15 flex items-center justify-center text-accent-soft">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Hub
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink-muted hover:text-ink px-3 py-2">
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="text-sm bg-accent hover:bg-accent-soft text-white rounded-xl2 px-4 py-2.5 transition-colors"
          >
            إنشاء حساب
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="القائمة">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-muted" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1 text-center text-sm border border-border rounded-xl2 px-4 py-2.5">
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center text-sm bg-accent text-white rounded-xl2 px-4 py-2.5"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
