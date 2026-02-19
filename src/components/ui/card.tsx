import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Card — XML 명세 3.4 기준
 *
 * Sizes:  lg(p-6 r-16), md(p-4 r-12), sm(p-3 r-12)
 * States: default, hover, active, focus, disabled, selected, loading, error
 */
const cardVariants = cva(
  [
    "bg-card text-card-foreground border transition-all duration-normal",
  ].join(" "),
  {
    variants: {
      cardSize: {
        lg: "p-6 rounded-2xl shadow-sm",
        default: "p-4 rounded-xl shadow-sm",
        sm: "p-3 rounded-xl shadow-xs",
      },
      state: {
        default: "border-neutral-200",
        hover: "border-neutral-200 hover:shadow-md hover:cursor-pointer",
        active: "bg-primary-50 border-2 border-primary shadow-sm",
        selected: "bg-primary-50 border-2 border-primary shadow-sm",
        disabled: "bg-neutral-100 border-neutral-200 shadow-none opacity-60 pointer-events-none",
        error: "bg-error-light border-error shadow-xs",
      },
    },
    defaultVariants: {
      cardSize: "default",
      state: "default",
    },
  },
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, cardSize, state, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ cardSize, state, className }))}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-heading-md font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-body-md text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
