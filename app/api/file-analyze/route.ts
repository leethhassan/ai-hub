import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

const bodySchema = z.object({
  fileText: z.string().min(1).max(20000),
  fileName: z.string().min(1),
  question: z.string().min(1).max(1000)
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  const { fileText, fileName, question } = parsed.data;

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "files");
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }, { status: 500 });
  }
  if (!usage.allowed) {
    return NextResponse.json({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }, { status: 429 });
  }

  try {
    const provider = getAIProvider();
    const result = await provider.chat([
      {
        role: "system",
        content: "أنت مساعد لتحليل الملفات. أجب عن سؤال المستخدم اعتمادًا فقط على محتوى الملف المرفق أدناه، بإيجاز ووضوح."
      },
      { role: "user", content: `اسم الملف: ${fileName}\n\nمحتوى الملف:\n${fileText}\n\nالسؤال: ${question}` }
    ]);

    return NextResponse.json({ result, remaining: usage.remaining });
  } catch {
    return NextResponse.json({ error: "حدث خطأ مؤقت أثناء معالجة طلبك. حاول مرة أخرى." }, { status: 502 });
  }
}
