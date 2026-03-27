"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { TransitionLink } from "@/components/shared/transition-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#problem", label: "Why now" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "/map", label: "Live map" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bark/6 bg-cream/80 backdrop-blur-sm">
      <div className="page-shell flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo href="/" variant="mark" priority className="sm:hidden" />
          <BrandLogo href="/" variant="lockup" priority className="hidden sm:block" />
          <div className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-bark-light lg:block">Pilot launch</div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <TransitionLink key={item.href} href={item.href} className="text-sm text-bark-light hover:text-bark">
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <TransitionLink href="/auth" className="text-sm text-bark-light hover:text-bark">
            Log in
          </TransitionLink>
          <TransitionLink href="/map" className={buttonVariants()}>
            Find free resources
          </TransitionLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-bark/12 bg-stone text-bark md:hidden"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="border-t border-bark/6 bg-cream md:hidden"
          >
            <div className="page-shell flex flex-col gap-5 py-6">
              {navItems.map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base text-bark-light transition hover:text-bark",
                    item.href.startsWith("#") && "scroll-smooth"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </TransitionLink>
              ))}
              <div className="flex gap-3 pt-2">
                <TransitionLink href="/map" className={cn(buttonVariants(), "flex-1")}>
                  Open app
                </TransitionLink>
                <TransitionLink href="/auth" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                  Log in
                </TransitionLink>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
