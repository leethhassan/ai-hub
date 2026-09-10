import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-border bg-bg-card/60 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}
