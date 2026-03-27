import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-[20px] border border-bark/12 bg-cream px-4 py-3 text-sm text-bark shadow-sm transition placeholder:text-bark-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,106,79,0.3)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
