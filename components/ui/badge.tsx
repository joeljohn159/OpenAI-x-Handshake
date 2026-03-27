import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "border-bark/10 bg-cream text-bark-light",
        verified: "border-moss/20 bg-moss-subtle text-moss",
        unverified: "border-unverified/20 bg-[#FBF2D7] text-[#8D6A12]",
        gone: "border-gone/20 bg-[#F8E1DE] text-gone",
        outline: "border-bark/15 bg-transparent text-bark"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
