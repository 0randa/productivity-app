import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[var(--window-bg)] border-[3px] border-[var(--window-border)] shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),5px_5px_0_rgba(0,0,0,0.15)] text-[var(--text-dark)]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-5 pb-3", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-pixel text-[11px] tracking-wider uppercase leading-relaxed text-[var(--text-dark)]", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-pixel-body text-[18px] leading-snug text-[var(--text-muted)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0 gap-3", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardInner = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[var(--window-bg)] border-[2px] border-[var(--window-border)] shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)] p-4",
      className
    )}
    {...props}
  />
));
CardInner.displayName = "CardInner";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardInner };
