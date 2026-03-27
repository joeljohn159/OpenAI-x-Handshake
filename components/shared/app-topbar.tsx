"use client";

import { MapPinned, Medal, Plus, UserCircle2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCampusShare } from "@/components/providers/campusshare-provider";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TransitionLink } from "@/components/shared/transition-link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/map", label: "Map", icon: MapPinned },
  { href: "/leaderboard", label: "Leaderboard", icon: Medal },
  { href: "/profile", label: "Profile", icon: UserCircle2 }
];

export function AppTopBar() {
  const { activeCampus, currentUser, signOut } = useCampusShare();

  return (
    <div className="absolute inset-x-0 top-0 z-[500] p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between rounded-[28px] border border-white/45 bg-cream/84 px-4 py-3 shadow-soft backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo href="/" variant="mark" className="sm:hidden" />
            <BrandLogo href="/" variant="lockup" className="hidden sm:block sm:w-[184px] lg:w-[210px]" />
            <div className="hidden text-xs text-bark-light lg:block">{activeCampus.shortName} · {activeCampus.city}</div>
          </div>
          <Badge className="hidden border-none bg-stone text-bark-light lg:inline-flex">{activeCampus.name}</Badge>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full border border-transparent bg-transparent px-4 py-2 text-bark-light hover:border-bark/8 hover:bg-stone"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </TransitionLink>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <TransitionLink href="/post" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            <Plus className="h-4 w-4" />
            Post resource
          </TransitionLink>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-bark">@{currentUser.username}</div>
                <div className="text-xs text-bark-light">{currentUser.points} points</div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <TransitionLink href="/auth" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Log in
            </TransitionLink>
          )}
        </div>
      </div>
    </div>
  );
}
