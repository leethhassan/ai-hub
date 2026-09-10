import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: NextRequest) {
  const supabase = createClient(req);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "لم يتم إرفاق ملف صوتي." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "حجم الملف يجب ألا يتجاوز 20 ميغابايت." }, { status: 400 });

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "speech");
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }, { status: 500 });
  }
  if (!usage.allowed) {
    return NextResponse.json({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }, { status: 429 });
  }

  try {
    const provider = getAIProvider();
    const text = await provider.transcribe(file, file.name);
    return NextResponse.json({ text, remaining: usage.remaining });
  } catch {
    return NextResponse.json({ error: "حدث خطأ مؤقت أثناء تحويل الصوت إلى نص. حاول مرة أخرى." }, { status: 502 });
  }
}
