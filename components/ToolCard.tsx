import Link from "next/link";
import { LucideIcon, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ToolCard({
  icon: Icon,
  name,
  description,
  href
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="p-5 flex flex-col gap-4 hover:border-accent/50 transition-colors group">
      <div className="h-10 w-10 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-ink mb-1">{name}</h3>
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm text-accent-soft group-hover:gap-2.5 transition-all"
      >
        استخدم الآن
        <ArrowLeft className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}
