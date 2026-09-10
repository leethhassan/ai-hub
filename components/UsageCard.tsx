import { Card } from "@/components/ui/Card";

export function UsageCard({
  label,
  used,
  limit
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-ink-muted">{label}</span>
        <span className="text-sm font-medium">
          {used}/{limit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-soft overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-l from-accent to-accent-glow transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}
