import Image from "next/image";

import { TransitionLink } from "@/components/shared/transition-link";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "mark" | "lockup";

export function BrandLogo({
  href,
  variant = "lockup",
  className,
  priority = false
}: {
  href?: string;
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
}) {
  const isMark = variant === "mark";
  const src = isMark ? "/icons/logo-mark.svg" : "/icons/logo-lockup.svg";
  const width = isMark ? 44 : 262;
  const height = isMark ? 44 : 62;
  const image = (
    <Image
      src={src}
      alt="CampusShare"
      width={width}
      height={height}
      priority={priority}
      className={cn(isMark ? "h-11 w-11" : "h-auto w-[196px] sm:w-[220px] md:w-[244px]", className)}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <TransitionLink href={href} className="inline-flex items-center" aria-label="CampusShare home">
      {image}
    </TransitionLink>
  );
}
