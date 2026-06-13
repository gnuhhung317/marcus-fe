import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-border bg-surface text-main",
    success: "border-border bg-positive-soft text-positive",
    warning: "border-border bg-warning-soft text-warning",
    error: "border-border bg-negative-soft text-negative",
    info: "border-border bg-info-soft text-info",
    outline: "border-border text-main bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
