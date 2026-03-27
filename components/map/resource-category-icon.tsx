import { Backpack, CalendarDays, PackageOpen, UtensilsCrossed } from "lucide-react";

import type { ResourceCategory } from "@/lib/types";

export function ResourceCategoryIcon({
  category,
  className = "h-5 w-5"
}: {
  category: ResourceCategory;
  className?: string;
}) {
  switch (category) {
    case "food":
      return <UtensilsCrossed className={className} />;
    case "pantry":
      return <PackageOpen className={className} />;
    case "supplies":
      return <Backpack className={className} />;
    case "event":
      return <CalendarDays className={className} />;
    default:
      return <PackageOpen className={className} />;
  }
}
