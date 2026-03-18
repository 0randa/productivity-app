import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-pixel text-[10px] tracking-widest uppercase transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--poke-red)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--window-bg)] text-[var(--text-dark)] border-[3px] border-[var(--window-border)] shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),3px_3px_0_rgba(0,0,0,0.15)] hover:shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),4px_4px_0_rgba(0,0,0,0.2)] hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5",
        primary:
          "bg-[var(--poke-red)] text-[var(--text-light)] border-[3px] border-[var(--poke-red-dark)] shadow-[inset_2px_2px_0_var(--poke-red-light),inset_-2px_-2px_0_var(--poke-red-dark),3px_3px_0_rgba(0,0,0,0.15)] hover:bg-[#e85050] hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5",
        secondary:
          "bg-[var(--poke-blue)] text-[var(--text-light)] border-[3px] border-[var(--poke-blue-dark)] shadow-[inset_2px_2px_0_var(--poke-blue-light),inset_-2px_-2px_0_var(--poke-blue-dark),3px_3px_0_rgba(0,0,0,0.15)] hover:bg-[#4878c0] hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5",
        ghost:
          "border-[2px] border-transparent text-[var(--text-muted)] hover:border-[var(--window-border)] hover:text-[var(--text-dark)]",
        destructive:
          "bg-[var(--poke-red)] text-[var(--text-light)] border-[3px] border-[var(--poke-red-dark)] shadow-[inset_2px_2px_0_var(--poke-red-light),inset_-2px_-2px_0_var(--poke-red-dark),3px_3px_0_rgba(0,0,0,0.15)]",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3 py-1.5 text-[8px]",
        lg: "px-7 py-3.5 text-[12px]",
        icon: "w-9 h-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
