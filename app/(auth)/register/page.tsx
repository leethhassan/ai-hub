"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 8) {
      setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    setLoading(false);
    if (error) {
      setError(error.message === "User already registered" ? "هذا البريد الإلكتروني مسجّل مسبقًا." : "تعذر إنشاء الحساب. حاول مرة أخرى.");
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 text-center">
        <div className="max-w-sm">
          <h1 className="text-xl font-bold mb-3">تحقق من بريدك الإلكتروني</h1>
          <p className="text-sm text-ink-muted">
            أرسلنا رابط تفعيل إلى {email}. افتح الرابط لتفعيل حسابك ثم سجّل الدخول.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <span className="h-10 w-10 rounded-xl2 bg-accent/15 flex items-center justify-center text-accent-soft mb-4">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-bold">إنشاء حساب جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">الاسم</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" />
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">البريد الإلكتروني</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">كلمة المرور</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" loading={loading} className="mt-2 w-full">
            إنشاء حساب
          </Button>
        </form>

        <p className="text-sm text-ink-muted text-center mt-6">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-accent-soft hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
