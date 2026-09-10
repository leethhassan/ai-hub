import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && "bg-accent hover:bg-accent-soft text-white",
          variant === "secondary" && "bg-bg-card border border-border hover:border-accent/60 text-ink",
          variant === "ghost" && "hover:bg-bg-card text-ink-muted hover:text-ink",
          variant === "danger" && "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30",
          size === "sm" && "text-sm px-3 py-1.5",
          size === "md" && "text-sm px-4 py-2.5",
          size === "lg" && "text-base px-6 py-3.5",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
