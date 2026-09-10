import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

const bodySchema = z.object({
  text: z.string().min(1).max(20000),
  mode: z.enum(["short", "medium", "detailed"])
});

const modeMap = {
  short: "ملخص قصير جدًا في 2-3 جمل",
  medium: "ملخص متوسط في فقرة واحدة تغطي أهم النقاط",
  detailed: "ملخص مفصل على شكل نقاط يغطي جميع الأفكار الرئيسية"
};

export async function POST(req: NextRequest) {
  const supabase = createClient(req);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  const { text, mode } = parsed.data;

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "summarizer");
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }, { status: 500 });
  }
  if (!usage.allowed) {
    return NextResponse.json({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }, { status: 429 });
  }

  try {
    const provider = getAIProvider();
    const result = await provider.chat([
      { role: "system", content: `أنت خبير تلخيص. اكتب ${modeMap[mode]}، باللغة نفسها التي كُتب بها النص الأصلي.` },
      { role: "user", content: text }
    ]);
    return NextResponse.json({ result, remaining: usage.remaining });
  } catch {
    return NextResponse.json({ error: "حدث خطأ مؤقت أثناء معالجة طلبك. حاول مرة أخرى." }, { status: 502 });
  }
}
