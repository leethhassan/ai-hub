import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

const bodySchema = z.object({
  contentType: z.string().min(1),
  topic: z.string().min(1).max(2000),
  tone: z.string().min(1),
  language: z.enum(["ar", "en"]),
  length: z.enum(["short", "medium", "long"])
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  const { contentType, topic, tone, language, length } = parsed.data;

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "writer");
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }, { status: 500 });
  }
  if (!usage.allowed) {
    return NextResponse.json({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }, { status: 429 });
  }

  const lengthMap = { short: "قصير (حوالي 100 كلمة)", medium: "متوسط (حوالي 250 كلمة)", long: "طويل (حوالي 500 كلمة)" };

  try {
    const provider = getAIProvider();
    const text = await provider.chat([
      {
        role: "system",
        content: `أنت كاتب محتوى محترف. اكتب باللغة ${language === "ar" ? "العربية" : "الإنجليزية"} فقط، بنبرة ${tone}، وبطول ${lengthMap[length]}.`
      },
      { role: "user", content: `اكتب محتوى من نوع "${contentType}" حول الموضوع التالي:\n${topic}` }
    ]);

    return NextResponse.json({ result: text, remaining: usage.remaining });
  } catch {
    return NextResponse.json({ error: "حدث خطأ مؤقت أثناء معالجة طلبك. حاول مرة أخرى." }, { status: 502 });
  }
}
