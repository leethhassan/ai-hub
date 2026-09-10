import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";
import { getAIProvider } from "@/lib/ai";

export const runtime = "nodejs";

const bodySchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1).max(8000)
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "يجب تسجيل الدخول أولًا." }), { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "بيانات الطلب غير صالحة." }), { status: 400 });
  }
  const { message } = parsed.data;
  let { conversationId } = parsed.data;

  let usage;
  try {
    usage = await checkAndIncrementUsage(supabase, user.id, "chat");
  } catch {
    return new Response(JSON.stringify({ error: "حدث خطأ أثناء التحقق من حد الاستخدام." }), { status: 500 });
  }

  if (!usage.allowed) {
    return new Response(
      JSON.stringify({ error: "لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا." }),
      { status: 429 }
    );
  }

  // Create a conversation if this is a new chat
  if (!conversationId) {
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select("id")
      .single();

    if (convError || !conv) {
      return new Response(JSON.stringify({ error: "تعذر إنشاء محادثة جديدة." }), { status: 500 });
    }
    conversationId = conv.id;
  } else {
    // Verify ownership (RLS also enforces this, but fail fast with a clear error)
    const { data: conv } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!conv) {
      return new Response(JSON.stringify({ error: "المحادثة غير موجودة." }), { status: 404 });
    }
  }

  await supabase.from("messages").insert({ conversation_id: conversationId, role: "user", content: message });

  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(30);

  const provider = getAIProvider();

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`__CONV__${conversationId}__\n`));
      try {
        for await (const chunk of provider.chatStream(
          [
            {
              role: "system",
              content: "أنت مساعد ذكاء اصطناعي عربي مفيد ومهذب يجيب بإيجاز ووضوح."
            },
            ...(history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
          ]
        )) {
          fullText += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const msg = "حدث خطأ مؤقت أثناء معالجة طلبك. حاول مرة أخرى.";
        controller.enqueue(encoder.encode(msg));
        fullText = msg;
      } finally {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: fullText
        });
        await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId!);
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
