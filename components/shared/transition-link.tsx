"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { useRouteTransition } from "@/components/providers/route-transition-provider";

type TransitionLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function toHrefString(href: LinkProps["href"]) {
  if (typeof href === "string") {
    return href;
  }

  const pathname = href.pathname ?? "";
  const hash = href.hash ? `#${href.hash}` : "";
  return `${pathname}${hash}`;
}

export function TransitionLink({ href, onClick, target, ...props }: TransitionLinkProps) {
  const pathname = usePathname();
  const { beginTransition } = useRouteTransition();
  const hrefString = toHrefString(href);

  return (
    <Link
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          isModifiedEvent(event) ||
          target === "_blank" ||
          hrefString.startsWith("mailto:") ||
          hrefString.startsWith("tel:") ||
          hrefString.startsWith("#")
        ) {
          return;
        }

        const destinationPath = hrefString.split("#")[0];

        if (!destinationPath || destinationPath === pathname) {
          return;
        }

        beginTransition();
      }}
      {...props}
    />
  );
}
