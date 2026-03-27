import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-cream",
  {
    variants: {
      variant: {
        default:
          "bg-moss px-5 py-3 text-cream shadow-float hover:-translate-y-0.5 hover:bg-moss-light",
        secondary:
          "border border-bark/10 bg-stone px-5 py-3 text-bark shadow-soft hover:-translate-y-0.5 hover:border-moss/20 hover:bg-cream",
        outline:
          "border border-bark/20 bg-transparent px-5 py-3 text-bark hover:-translate-y-0.5 hover:border-moss hover:text-moss",
        ghost: "px-4 py-2 text-bark-light hover:bg-stone hover:text-bark",
        destructive: "bg-gone px-5 py-3 text-cream shadow-float hover:-translate-y-0.5 hover:bg-[#d06359]"
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-sm",
        lg: "px-6 py-4 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
