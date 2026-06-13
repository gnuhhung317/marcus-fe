import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variants = {
      primary: "bg-primary text-inverse hover:brightness-110 shadow-[0_8px_20px_rgba(16,185,129,0.22)]",
      secondary: "bg-surface border-border text-main hover:bg-surface-hover",
      danger: "bg-negative text-white hover:brightness-110",
      ghost: "bg-transparent hover:bg-surface-hover text-main",
      outline: "bg-transparent border border-border text-main hover:bg-surface-hover",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
      icon: "p-2.5",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {asChild ? children : (
          <>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
