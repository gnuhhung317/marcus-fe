import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glass-strong";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variants = {
    default: "bg-surface border-border",
    glass: "glass",
    "glass-strong": "glass-strong",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
