import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-main",
        secondary: "border-border bg-secondary text-secondary-foreground",
        success: "border-border bg-primary-soft text-positive",
        warning: "border-border bg-warning-soft text-warning",
        error: "border-border bg-negative-soft text-negative",
        destructive: "border-border bg-negative-soft text-negative",
        info: "border-border bg-info-soft text-info",
        outline: "border-border bg-transparent text-main",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
});
Badge.displayName = "Badge";

export { badgeVariants };
