"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      return;
    }

    router.push(params.get("redirect") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <span className="h-10 w-10 rounded-xl2 bg-accent/15 flex items-center justify-center text-accent-soft mb-4">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-bold">تسجيل الدخول إلى AI Hub</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">البريد الإلكتروني</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-ink-muted">كلمة المرور</label>
              <Link href="/forgot-password" className="text-xs text-accent-soft hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" loading={loading} className="mt-2 w-full">
            تسجيل الدخول
          </Button>
        </form>

        <p className="text-sm text-ink-muted text-center mt-6">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-accent-soft hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
