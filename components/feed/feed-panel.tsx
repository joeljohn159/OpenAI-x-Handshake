"use client";

import { BellRing, Clock3, MapPinned, SlidersHorizontal } from "lucide-react";

import { useCampusShare } from "@/components/providers/campusshare-provider";
import { Badge } from "@/components/ui/badge";
import type { Resource, ResourceCategory } from "@/lib/types";
import {
  categoryStyles,
  formatDistanceLabel,
  formatRelativeTime,
  getTrustState,
  isResourceLive
} from "@/lib/utils";
import { useCountdown } from "@/hooks/use-countdown";
import { ResourceCategoryIcon } from "@/components/map/resource-category-icon";

const categoryFilters: Array<{ value: ResourceCategory | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "food", label: "Food" },
  { value: "pantry", label: "Pantry" },
  { value: "supplies", label: "Supplies" },
  { value: "event", label: "Events" }
];

function FeedItem({
  resource,
  distanceMeters,
  onSelect
}: {
  resource: Resource;
  distanceMeters: number;
  onSelect: () => void;
}) {
  const countdown = useCountdown(resource.expires_at);
  const trust = getTrustState(resource);
  const style = categoryStyles[resource.category];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="bulletin-note w-full rounded-[26px] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
      style={{ borderLeft: `4px solid ${style.color}` }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-[18px]" style={{ backgroundColor: style.accent, color: style.color }}>
          <ResourceCategoryIcon category={resource.category} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-bark">{resource.title}</div>
              <div className="mt-1 text-sm text-bark-light">{resource.building_name ?? resource.campus ?? "Campus spot"}</div>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-bark-faint">{formatRelativeTime(resource.created_at)}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-bark-light">
            <div className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1">
              <MapPinned className="h-3.5 w-3.5" />
              {formatDistanceLabel(distanceMeters)}
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1">
              <Clock3 className="h-3.5 w-3.5" />
              {countdown}
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1">
              <span className="trust-dot" style={{ backgroundColor: trust.tone === "verified" ? "var(--verified)" : trust.tone === "gone" ? "var(--gone)" : "var(--unverified)" }} />
              {trust.label}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function FeedPanel({
  resources,
  recentExpired,
  userPosition,
  onSelectResource
}: {
  resources: Array<Resource & { distanceMeters: number }>;
  recentExpired: Resource[];
  userPosition: { latitude: number; longitude: number };
  onSelectResource: (resourceId: string) => void;
}) {
  const { filters, setFilters, notificationPermission, requestNotificationPermission, watchZone, setWatchZone } =
    useCampusShare();

  return (
    <aside
      className="flex h-full min-h-0 flex-col overflow-hidden border-r border-bark/8 bg-cream/88 backdrop-blur-md"
      onWheelCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
    >
      <div className="h-full min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pb-12 pt-28 [scrollbar-gutter:stable] [touch-action:pan-y] md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-bark-light">Live feed</div>
            <h2 className="mt-2 font-serif text-3xl text-bark">Fresh around campus</h2>
          </div>
          <div className="rounded-full bg-stone p-3 text-bark-light">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categoryFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilters((current) => ({ ...current, category: item.value }))}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filters.category === item.value
                  ? "bg-moss text-cream shadow-float"
                  : "border border-bark/10 bg-stone text-bark-light hover:text-bark"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[24px] border border-bark/8 bg-stone/88 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-bark">Distance radius</div>
              <div className="text-sm text-bark-light">Within {(filters.maxDistance / 1609.34).toFixed(1)} miles</div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-cream px-3 py-2 text-sm text-bark">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-bark/20 text-moss focus:ring-[rgba(45,106,79,0.3)]"
                checked={filters.availableNow}
                onChange={(event) => setFilters((current) => ({ ...current, availableNow: event.target.checked }))}
              />
              Available now
            </label>
          </div>

          <input
            type="range"
            min={250}
            max={3200}
            step={50}
            value={filters.maxDistance}
            onChange={(event) => setFilters((current) => ({ ...current, maxDistance: Number(event.target.value) }))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-cream accent-[var(--moss)]"
            aria-label="Maximum distance filter"
          />
        </div>

        <div className="mt-4 rounded-[24px] border border-bark/8 bg-cream p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-bark">Watch zone</div>
              <div className="mt-1 text-sm text-bark-light">
                {Math.round(watchZone.radius_meters)}m around your current position
              </div>
            </div>
            <button
              type="button"
              onClick={() => void requestNotificationPermission()}
              className="inline-flex items-center gap-2 rounded-full border border-bark/10 bg-stone px-3 py-2 text-sm text-bark hover:bg-cream"
            >
              <BellRing className="h-4 w-4" />
              {notificationPermission === "granted" ? "Enabled" : "Notify"}
            </button>
          </div>
          <input
            type="range"
            min={200}
            max={1500}
            step={50}
            value={watchZone.radius_meters}
            onChange={(event) =>
              setWatchZone((current) => ({
                ...current,
                latitude: userPosition.latitude,
                longitude: userPosition.longitude,
                radius_meters: Number(event.target.value)
              }))
            }
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-stone accent-[var(--moss)]"
            aria-label="Watch zone radius"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {(["food", "pantry", "supplies", "event"] as ResourceCategory[]).map((category) => {
              const selected = watchZone.categories.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setWatchZone((current) => ({
                      ...current,
                      categories: selected
                        ? current.categories.filter((item) => item !== category)
                        : [...current.categories, category]
                    }))
                  }
                  className={`rounded-full px-3 py-2 text-sm transition ${
                    selected ? "bg-moss-subtle text-moss" : "border border-bark/10 bg-stone text-bark-light"
                  }`}
                >
                  {categoryStyles[category].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 mt-8 flex items-center justify-between border-t border-bark/8 pt-6">
          <div className="text-sm font-medium text-bark">{resources.length} live posts</div>
          <Badge>{filters.availableNow ? "Fresh only" : "Showing all"}</Badge>
        </div>

        <div className="space-y-4">
          {resources.map((resource) => (
            <FeedItem
              key={resource.id}
              resource={resource}
              distanceMeters={resource.distanceMeters}
              onSelect={() => onSelectResource(resource.id)}
            />
          ))}
        </div>

        {recentExpired.length ? (
          <div className="mt-8 rounded-[28px] border border-bark/8 bg-stone/72 p-4">
            <div className="mb-3 text-sm font-medium text-bark">Recently expired</div>
            <div className="space-y-3">
              {recentExpired.slice(0, 4).map((resource) => (
                <div key={resource.id} className="rounded-[20px] border border-bark/8 bg-cream px-4 py-3">
                  <div className="text-sm font-medium text-bark">{resource.title}</div>
                  <div className="mt-1 text-sm text-bark-light">
                    {resource.building_name ?? resource.campus ?? "Campus spot"} · {!isResourceLive(resource) ? "Archived" : "Reported gone"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
