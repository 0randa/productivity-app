import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full font-pixel-body text-[22px] px-3 py-2 border-[3px] border-[var(--window-border)] bg-[var(--window-bg)] text-[var(--text-dark)] shadow-[inset_2px_2px_0_var(--window-shadow)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--poke-blue)] focus:shadow-[inset_2px_2px_0_var(--window-shadow),0_0_0_2px_rgba(56,104,176,0.3)] disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
