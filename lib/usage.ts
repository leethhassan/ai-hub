import { SupabaseClient } from "@supabase/supabase-js";
import { DAILY_LIMITS, ToolKey } from "@/types";

/**
 * Server-side usage guard. Call this at the top of every AI API route,
 * AFTER authenticating the user and BEFORE calling the AI provider.
 * Never trust a client-supplied usage count — this always reads from Supabase.
 */
export async function checkAndIncrementUsage(
  supabase: SupabaseClient,
  userId: string,
  tool: ToolKey
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const today = new Date().toISOString().slice(0, 10);
  const limit = DAILY_LIMITS[tool];

  const { data: existing, error: readError } = await supabase
    .from("usage")
    .select("id, count")
    .eq("user_id", userId)
    .eq("tool", tool)
    .eq("day", today)
    .maybeSingle();

  if (readError) {
    throw new Error("تعذر التحقق من حد الاستخدام");
  }

  const currentCount = existing?.count ?? 0;

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("usage")
      .update({ count: currentCount + 1 })
      .eq("id", existing.id);
    if (updateError) throw new Error("تعذر تحديث الاستخدام");
  } else {
    const { error: insertError } = await supabase
      .from("usage")
      .insert({ user_id: userId, tool, day: today, count: 1 });
    if (insertError) throw new Error("تعذر تسجيل الاستخدام");
  }

  return { allowed: true, remaining: limit - currentCount - 1, limit };
}

export async function getTodayUsage(supabase: SupabaseClient, userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("usage")
    .select("tool, count")
    .eq("user_id", userId)
    .eq("day", today);

  const result: Record<string, { used: number; limit: number }> = {};
  for (const tool of Object.keys(DAILY_LIMITS) as ToolKey[]) {
    const row = data?.find((d) => d.tool === tool);
    result[tool] = { used: row?.count ?? 0, limit: DAILY_LIMITS[tool] };
  }
  return result;
}
