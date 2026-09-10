import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Users, UserPlus, Activity, AlertTriangle } from "lucide-react";

export default async function AdminPage() {
  const supabase = createClient();
  // Service client used here only to compute aggregate platform-wide counts;
  // the layout above already verified the caller is an admin.
  const service = createServiceClient();

  const { count: totalUsers } = await service.from("profiles").select("id", { count: "exact", head: true });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: newUsers } = await service
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo);

  const today = new Date().toISOString().slice(0, 10);
  const { data: usageToday } = await service.from("usage").select("tool, count").eq("day", today);

  const totalRequestsToday = (usageToday ?? []).reduce((sum: number, r: any) => sum + r.count, 0);

  const toolTotals: Record<string, number> = {};
  for (const row of usageToday ?? []) {
    toolTotals[row.tool] = (toolTotals[row.tool] ?? 0) + row.count;
  }
  const topTools = Object.entries(toolTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-1">لوحة الإدارة</h1>
      <p className="text-ink-muted mb-8">نظرة عامة على المنصة.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalUsers ?? 0}</p>
            <p className="text-sm text-ink-muted">إجمالي المستخدمين</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{newUsers ?? 0}</p>
            <p className="text-sm text-ink-muted">مستخدمون جدد (7 أيام)</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalRequestsToday}</p>
            <p className="text-sm text-ink-muted">طلبات اليوم</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">—</p>
            <p className="text-sm text-ink-muted">الأخطاء (قريبًا)</p>
          </div>
        </Card>
      </div>

      <h2 className="font-medium mb-4">أكثر الأدوات استخدامًا اليوم</h2>
      <Card className="divide-y divide-border">
        {topTools.length === 0 ? (
          <p className="p-5 text-sm text-ink-muted">لا يوجد استخدام مسجّل اليوم بعد.</p>
        ) : (
          topTools.map(([tool, count]) => (
            <div key={tool} className="p-4 text-sm flex items-center justify-between">
              <span>{tool}</span>
              <span className="text-ink-muted">{count} طلب</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
