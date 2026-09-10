import { cn } from "@/lib/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl2 border border-border bg-bg-soft px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-accent resize-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
