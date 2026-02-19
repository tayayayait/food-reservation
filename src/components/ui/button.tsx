import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button — XML 명세 3.1 기준
 *
 * Variants: filled-primary, filled-danger, outlined, outlined-neutral, ghost, ghost-neutral
 * Sizes:    lg(52px), md(44px), sm(36px), xs(28px), icon
 * States:   default, hover, active, focus, disabled, loading, error
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "ring-offset-background transition-all duration-normal",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "active:scale-[0.98] active:transition-transform active:duration-fast",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // XML 명세 filled-primary
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-400 hover:shadow-sm active:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400",
        // XML 명세 filled-danger
        destructive:
          "bg-error text-white shadow-xs hover:bg-error/90 hover:shadow-sm active:bg-error-dark disabled:bg-neutral-200 disabled:text-neutral-400",
        // XML 명세 outlined
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100 disabled:border-neutral-300 disabled:text-neutral-400",
        // XML 명세 outlined-neutral
        "outline-neutral":
          "border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400",
        // XML 명세 ghost
        ghost:
          "bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100 disabled:text-neutral-400",
        // XML 명세 ghost-neutral
        "ghost-neutral":
          "bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400",
        // 하위 호환: shadcn 기본
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50",
        link: "text-primary underline-offset-4 hover:underline disabled:opacity-50",
      },
      size: {
        // XML 명세 사이즈
        lg: "h-[52px] px-6 rounded-xl text-btn-lg min-w-[120px] [&_svg]:size-5",
        default: "h-[44px] px-5 rounded-xl text-btn-md min-w-[80px] [&_svg]:size-5",
        sm: "h-[36px] px-4 rounded-lg text-btn-sm min-w-[60px] [&_svg]:size-4",
        xs: "h-[28px] px-3 rounded-md text-body-xs min-w-[40px] [&_svg]:size-3.5",
        icon: "h-[44px] w-[44px] rounded-xl [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Loading 상태 — 스피너 표시, 텍스트 숨김 */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "relative text-transparent pointer-events-none",
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-current" style={{ color: "inherit" }} />
          </span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
