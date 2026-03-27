"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, ShieldCheck, X } from "lucide-react";

import { useCampusShare } from "@/components/providers/campusshare-provider";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/types";
import {
  categoryStyles,
  formatRelativeTime,
  getTrustState,
  initialsForName,
  isExpiringSoon,
  isRecentlyVerified
} from "@/lib/utils";
import { useCountdown } from "@/hooks/use-countdown";

export function ResourceDetailSheet({
  resource,
  onClose
}: {
  resource: Resource | null;
  onClose: () => void;
}) {
  const { confirmResource, currentUser, userVotes } = useCampusShare();
  const countdown = useCountdown(resource?.expires_at ?? new Date().toISOString());
  const activeVote = resource ? userVotes[resource.id] : undefined;

  if (!resource) {
    return null;
  }

  const trust = getTrustState(resource);
  const style = categoryStyles[resource.category];

  return (
    <AnimatePresence>
      <motion.div
        key={resource.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-[450] bg-gradient-to-t from-bark/18 to-transparent"
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 140 || info.velocity.y > 500) {
              onClose();
            }
          }}
          initial={{ y: 320 }}
          animate={{ y: 0 }}
          exit={{ y: 320 }}
          transition={{ type: "spring", stiffness: 210, damping: 24 }}
          className="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto flex max-h-[82vh] w-full max-w-[760px] flex-col overflow-hidden rounded-t-[36px] border border-bark/10 bg-cream shadow-soft md:bottom-auto md:right-6 md:left-auto md:top-24 md:max-h-[calc(100dvh-7rem)] md:w-[min(640px,calc(100%-3rem))] md:max-w-none md:rounded-[36px]"
        >
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-bark/10 md:hidden" />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 md:px-7 md:pb-6">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="border-none" style={{ backgroundColor: style.accent, color: style.color }}>
                    {categoryStyles[resource.category].label}
                  </Badge>
                  {isRecentlyVerified(resource.last_confirmation) ? (
                    <Badge variant="verified" className="animate-pulseDot border-none">
                      Just verified
                    </Badge>
                  ) : null}
                  {resource.poster && resource.poster.trust_score >= 85 ? (
                    <Badge variant="outline">Trusted poster</Badge>
                  ) : null}
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.02em] text-bark md:text-3xl">{resource.title}</h2>
                <p className="mt-3 text-sm text-bark-light">
                  {resource.building_name ?? "Campus location"} · Posted {formatRelativeTime(resource.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close resource details"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bark/10 bg-stone text-bark-light hover:bg-cream hover:text-bark"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto px-5 pb-6 md:px-7">
              {resource.image_url ? (
                <div className="relative h-44 overflow-hidden rounded-[28px] border border-bark/8">
                  <Image src={resource.image_url} alt={resource.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-bark/8 bg-stone/82 p-5">
                  <p className="text-base leading-7 text-bark-light">{resource.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-bark/8 bg-cream px-4 py-2 text-sm text-bark">
                      <Clock3 className="h-4 w-4 text-bark-light" />
                      <span className={isExpiringSoon(resource.expires_at) ? "text-urgent" : "text-bark"}>{countdown}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-bark/8 bg-cream px-4 py-2 text-sm text-bark">
                      <ShieldCheck className="h-4 w-4 text-bark-light" />
                      {resource.poster ? `@${resource.poster.username}` : "@campus_friend"}
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-bark/8 bg-cream p-5 shadow-note">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="trust-dot"
                      style={{
                        backgroundColor:
                          trust.tone === "verified" ? "var(--verified)" : trust.tone === "gone" ? "var(--gone)" : "var(--unverified)"
                      }}
                    />
                    <div className="text-sm font-medium text-bark">{trust.label}</div>
                  </div>
                  <p className="text-sm leading-6 text-bark-light">{trust.description}</p>
                  {resource.last_confirmation ? (
                    <div className="mt-4 rounded-[22px] border border-bark/8 bg-stone px-4 py-3 text-sm text-bark-light">
                      Last confirmed {formatRelativeTime(resource.last_confirmation.confirmed_at)} by @{resource.last_confirmation.username}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[32px] border border-bark/8 bg-stone p-5 md:p-6">
                <div className="mb-4">
                  <div className="text-lg font-medium text-bark">Is this still available?</div>
                  <p className="mt-1 text-sm text-bark-light">
                    One vote per person. Posts disappear from the live map when multiple people report they are gone.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => void confirmResource(resource.id, "available")}
                    className="rounded-[24px] border px-4 py-4 text-left transition"
                    style={{
                      borderColor: activeVote === "available" ? "rgba(45,106,79,0.3)" : "rgba(61,56,49,0.08)",
                      background: activeVote === "available" ? "rgba(216,243,220,0.9)" : "rgba(254,250,224,0.86)"
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-moss/10 text-moss">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-bark">Still there ({resource.still_available_count})</div>
                          <div className="text-sm text-bark-light">
                            {activeVote === "available" ? "You confirmed this" : "Mark it as still available"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => void confirmResource(resource.id, "gone")}
                    className="rounded-[24px] border px-4 py-4 text-left transition"
                    style={{
                      borderColor: activeVote === "gone" ? "rgba(193,85,77,0.28)" : "rgba(61,56,49,0.08)",
                      background: activeVote === "gone" ? "rgba(248,225,222,0.92)" : "rgba(254,250,224,0.86)"
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gone/10 text-gone">
                        <X className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-bark">Gone ({resource.gone_count})</div>
                        <div className="text-sm text-bark-light">
                          {activeVote === "gone" ? "You reported this as gone" : "Hide it if it has already been taken"}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {!currentUser ? (
                  <div className="mt-4 rounded-[20px] border border-bark/8 bg-cream px-4 py-3 text-sm text-bark-light">
                    Log in first to vote, build reputation, and unlock watch zone notifications.
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-4 rounded-[24px] border border-bark/8 bg-cream px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone text-bark font-mono">
                  {resource.poster ? initialsForName(resource.poster.username) : "CS"}
                </div>
                <div>
                  <div className="text-sm font-medium text-bark">{resource.poster ? `@${resource.poster.username}` : "Community member"}</div>
                  <div className="text-sm text-bark-light">
                    {resource.poster ? `${resource.poster.trust_score} trust score · ${resource.poster.points} points` : "New contributor"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
