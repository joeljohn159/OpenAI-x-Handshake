import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-[24px] border border-bark/12 bg-cream px-4 py-3 text-sm text-bark shadow-sm transition placeholder:text-bark-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,106,79,0.3)]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
