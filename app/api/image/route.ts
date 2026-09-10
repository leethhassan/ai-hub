import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

const bodySchema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z.string().optional(),
  aspectRatio: z.enum(["1024x1024", "1792x1024", "1024x1792"]).default("1024x1024")
});

export async function POST(req: NextRequest) {
  const supabase = createClient(req);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  const { prompt, style, aspectRatio } = parsed.data;

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "image");
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }, { status: 500 });
  }
  if (!usage.allowed) {
    return NextResponse.json({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }, { status: 429 });
  }

  try {
    const provider = getAIProvider();
    const fullPrompt = style ? `${prompt}, بأسلوب ${style}` : prompt;
    const url = await provider.generateImage(fullPrompt, { size: aspectRatio });

    await supabase.from("generated_images").insert({
      user_id: user.id,
      prompt,
      image_url: url,
      style: style ?? null,
      aspect_ratio: aspectRatio
    });

    return NextResponse.json({ url, remaining: usage.remaining });
  } catch {
    return NextResponse.json({ error: "حدث خطأ مؤقت أثناء توليد الصورة. حاول مرة أخرى." }, { status: 502 });
  }
}
