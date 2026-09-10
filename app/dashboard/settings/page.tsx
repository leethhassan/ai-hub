"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/Toast";

export default function SettingsPage() {
  const supabase = createClient();
  const { show } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("name, email, plan").eq("id", user.id).single();
      if (profile) {
        setName(profile.name ?? "");
        setEmail(profile.email);
        setPlan(profile.plan);
      }
    })();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
      show(error ? "تعذر حفظ التغييرات." : "تم حفظ التغييرات.", error ? "error" : "success");
    }
    setSavingProfile(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      show("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.", "error");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    show(error ? "تعذر تغيير كلمة المرور." : "تم تغيير كلمة المرور بنجاح.", error ? "error" : "success");
    setSavingPassword(false);
    setNewPassword("");
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">الإعدادات</h1>
      <p className="text-ink-muted mb-8">إدارة معلومات حسابك.</p>

      <Card className="p-5 mb-6">
        <h2 className="font-medium mb-4">الملف الشخصي</h2>
        <form onSubmit={saveProfile} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">الاسم</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">البريد الإلكتروني</label>
            <Input value={email} disabled />
          </div>
          <div>
            <label className="text-sm text-ink-muted mb-1.5 block">الخطة الحالية</label>
            <Input value={plan === "free" ? "مجانية" : plan} disabled />
          </div>
          <Button type="submit" loading={savingProfile} className="w-fit">
            حفظ التغييرات
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="font-medium mb-4">تغيير كلمة المرور</h2>
        <form onSubmit={changePassword} className="flex flex-col gap-4">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="كلمة المرور الجديدة"
          />
          <Button type="submit" loading={savingPassword} className="w-fit">
            تحديث كلمة المرور
          </Button>
        </form>
      </Card>
    </div>
  );
}
