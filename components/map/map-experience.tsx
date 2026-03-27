"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, ListFilter, Plus } from "lucide-react";

import { useCampusShare } from "@/components/providers/campusshare-provider";
import { FeedPanel } from "@/components/feed/feed-panel";
import { AppTopBar } from "@/components/shared/app-topbar";
import { ResourceDetailSheet } from "@/components/map/resource-detail-sheet";
import { TransitionLink } from "@/components/shared/transition-link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { distanceInMeters, isResourceLive } from "@/lib/utils";

const DynamicCampusMap = dynamic(() => import("@/components/map/campus-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-stone" />
});

export function MapExperience() {
  const {
    currentUser,
    filters,
    notificationPermission,
    requestNotificationPermission,
    resources,
    viewerPosition,
    recentExpired,
    selectedResourceId,
    setSelectedResourceId,
    watchZone
  } = useCampusShare();
  const [feedOpen, setFeedOpen] = useState(false);

  const liveResources = resources.filter((resource) => isResourceLive(resource));
  const filteredResources = liveResources
    .map((resource) => ({
      ...resource,
      distanceMeters: distanceInMeters(
        viewerPosition.latitude,
        viewerPosition.longitude,
        resource.latitude,
        resource.longitude
      )
    }))
    .filter((resource) => (filters.category === "all" ? true : resource.category === filters.category))
    .filter((resource) => resource.distanceMeters <= filters.maxDistance)
    .filter((resource) => (filters.availableNow ? resource.gone_count < 2 : true))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? null;

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-stone">
      <AppTopBar />

      <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[380px_1fr]">
        <div className="hidden h-full min-h-0 md:block">
          <FeedPanel
            resources={filteredResources}
            recentExpired={recentExpired}
            userPosition={viewerPosition}
            onSelectResource={setSelectedResourceId}
          />
        </div>

        <div className="relative h-full min-h-0">
          <DynamicCampusMap
            resources={filteredResources}
            selectedResourceId={selectedResourceId}
            onSelectResource={setSelectedResourceId}
            userPosition={viewerPosition}
            watchZone={watchZone}
          />

          <div className="absolute bottom-24 right-5 z-[420] flex flex-col gap-3 md:bottom-8 md:right-8">
            <button
              type="button"
              onClick={() => setFeedOpen((open) => !open)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-cream/88 text-bark shadow-soft backdrop-blur-md md:hidden"
              aria-label="Toggle feed panel"
            >
              <ListFilter className="h-5 w-5" />
            </button>

            <TransitionLink href="/post" className={buttonVariants({ size: "lg" })}>
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Share something</span>
            </TransitionLink>
          </div>

          <div className="absolute bottom-5 left-5 z-[420] flex max-w-[280px] flex-col gap-3 md:bottom-8 md:left-8">
            <div className="rounded-[24px] border border-white/35 bg-cream/88 px-4 py-3 shadow-soft backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-moss-subtle text-moss">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-bark">Watch zone</div>
                  <div className="mt-1 text-sm text-bark-light">
                    {Math.round(watchZone.radius_meters)}m around you · {watchZone.categories.length} categories
                  </div>
                </div>
              </div>
              {notificationPermission !== "granted" ? (
                <button
                  type="button"
                  onClick={() => void requestNotificationPermission()}
                  className="mt-3 inline-flex rounded-full border border-bark/10 bg-stone px-3 py-2 text-sm text-bark hover:bg-cream"
                >
                  Enable browser notifications
                </button>
              ) : (
                <Badge variant="verified" className="mt-3 border-none bg-moss-subtle text-moss">
                  Alerts enabled
                </Badge>
              )}
            </div>

            {!currentUser ? (
              <div className="rounded-[24px] border border-white/35 bg-cream/88 px-4 py-3 text-sm text-bark-light shadow-soft backdrop-blur-md">
                Log in to post resources, verify availability, and build a campus trust score.
              </div>
            ) : null}
          </div>

          <AnimatePresence>
            {feedOpen ? (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="absolute inset-x-0 bottom-0 z-[430] h-[76vh] overflow-hidden rounded-t-[36px] bg-cream shadow-soft md:hidden"
              >
                <FeedPanel
                  resources={filteredResources}
                  recentExpired={recentExpired}
                  userPosition={viewerPosition}
                  onSelectResource={(resourceId) => {
                    setSelectedResourceId(resourceId);
                    setFeedOpen(false);
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ResourceDetailSheet resource={selectedResource} onClose={() => setSelectedResourceId(null)} />
        </div>
      </div>
    </main>
  );
}
