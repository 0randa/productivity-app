import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-pixel text-[8px] tracking-widest uppercase leading-none border-[2px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--window-bg)] border-[var(--window-border)] text-[var(--text-dark)] px-2.5 py-1.5",
        red:
          "bg-[var(--poke-red)] border-[var(--poke-red-dark)] text-[var(--text-light)] px-2.5 py-1.5",
        blue:
          "bg-[var(--poke-blue)] border-[var(--poke-blue-dark)] text-[var(--text-light)] px-2.5 py-1.5",
        green:
          "bg-[var(--poke-green)] border-[var(--poke-green-dark)] text-[var(--text-light)] px-2.5 py-1.5",
        yellow:
          "bg-[var(--poke-yellow)] border-[var(--poke-yellow-dark)] text-[var(--text-dark)] px-2.5 py-1.5",
        outline:
          "bg-transparent border-[var(--window-border)] text-[var(--text-dark)] px-2.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
