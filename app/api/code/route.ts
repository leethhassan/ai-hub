import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

const bodySchema = z.object({
  code: z.string().min(1).max(10000),
  language: z.string().min(1),
  targetLanguage: z.string().optional(),
  action: z.enum(["explain", "fix", "optimize", "generate", "convert"])
});

const actionPrompts: Record<string, string> = {
  explain: "اشرح الكود التالي بوضوح باللغة العربية، خطوة بخطوة.",
  fix: "افحص الكود التالي وأصلح أي أخطاء فيه، واشرح ما تم إصلاحه باختصار.",
  optimize: "حسّن أداء وقراءة الكود التالي، واشرح التحسينات باختصار.",
  generate: "اكتب كودًا بناءً على الوصف التالي، مع تعليقات توضيحية.",
  convert: "حوّل الكود التالي إلى اللغة المستهدفة مع الحفاظ على نفس المنطق."
};

export async function POST(req: NextRequest) {
  const supabase = createClient(req);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  const { code, language, targetLanguage, action } = parsed.data;

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "code");
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }, { status: 500 });
  }
  if (!usage.allowed) {
    return NextResponse.json({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }, { status: 429 });
  }

  try {
    const provider = getAIProvider();
    const instruction =
      action === "convert"
        ? `${actionPrompts.convert} اللغة الأصلية: ${language}. اللغة المستهدفة: ${targetLanguage || "غير محددة"}.`
        : `${actionPrompts[action]} لغة البرمجة: ${language}.`;

    const result = await provider.chat([
      { role: "system", content: "أنت مساعد برمجي خبير. أعد الشرح باللغة العربية، وضع الكود داخل كتلة code markdown." },
      { role: "user", content: `${instruction}\n\n\`\`\`${language}\n${code}\n\`\`\`` }
    ]);

    return NextResponse.json({ result, remaining: usage.remaining });
  } catch {
    return NextResponse.json({ error: "حدث خطأ مؤقت أثناء معالجة طلبك. حاول مرة أخرى." }, { status: 502 });
  }
}
