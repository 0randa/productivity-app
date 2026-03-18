"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3.5 w-full overflow-hidden bg-[#303030] border-[2px] border-[var(--window-border)]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full transition-all duration-500 ease-in-out", indicatorClassName)}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
