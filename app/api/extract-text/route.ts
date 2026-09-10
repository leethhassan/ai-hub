import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const supabase = createClient(req);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "لم يتم إرفاق ملف." }, { status: 400 });

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "حجم الملف يجب ألا يتجاوز 5 ميغابايت." }, { status: 400 });
  }

  const allowed = ["application/pdf", "text/plain", "text/csv"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم. المسموح: PDF, TXT, CSV." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "application/pdf") {
      // Lazy import: pdf-parse pulls in a debug script at module scope in dev mode fixtures,
      // so we import it only inside the request handler.
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text.slice(0, 20000) });
    }

    // text/plain or text/csv
    return NextResponse.json({ text: buffer.toString("utf-8").slice(0, 20000) });
  } catch {
    return NextResponse.json({ error: "تعذر استخراج النص من هذا الملف." }, { status: 422 });
  }
}
