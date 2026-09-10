import { cn } from "@/lib/cn";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card
      className={cn(
        "p-6 flex flex-col gap-5",
        highlighted && "border-accent/60 shadow-[0_0_40px_-15px_rgba(110,91,255,0.5)]"
      )}
    >
      <div>
        <h3 className="font-medium text-ink">{name}</h3>
        <p className="text-sm text-ink-muted mt-1">{description}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "قريبًا" && <span className="text-sm text-ink-muted">/ شهريًا</span>}
      </div>
      <ul className="flex flex-col gap-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-ink-muted">
            <Check className="h-4 w-4 text-accent-glow mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </Card>
  );
}
