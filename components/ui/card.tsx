import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl border text-card-foreground", {
  variants: {
    variant: {
      default: "bg-surface border-border",
      glass: "glass",
      "glass-strong": "glass-strong",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />;
});
Card.displayName = "Card";

export { cardVariants };
