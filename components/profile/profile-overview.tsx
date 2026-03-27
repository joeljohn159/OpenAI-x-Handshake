"use client";

import { ShieldCheck, Star, Trophy } from "lucide-react";

import { useCampusShare } from "@/components/providers/campusshare-provider";
import { TransitionLink } from "@/components/shared/transition-link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isResourceLive } from "@/lib/utils";

function buildBadges(postsCount: number, confirmationsCount: number, trustScore: number) {
  const badges = [];

  if (postsCount > 0) badges.push("First Post");
  if (postsCount >= 10) badges.push("Food Hero");
  if (confirmationsCount >= 20) badges.push("Reliable Reporter");
  if (trustScore >= 85) badges.push("Trusted Poster");

  return badges;
}

export function ProfileOverview() {
  const { currentUser, resources } = useCampusShare();

  if (!currentUser) {
    return (
      <div className="rounded-[36px] border border-bark/8 bg-cream p-8 shadow-soft">
        <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">Profile</h1>
        <p className="mt-5 max-w-[32rem] text-lg leading-8 text-bark-light">
          Log in to see your trust score, contributions, badges, and the resources you have helped keep visible.
        </p>
        <div className="mt-8">
          <TransitionLink href="/auth" className={cn(buttonVariants())}>
            Open auth
          </TransitionLink>
        </div>
      </div>
    );
  }

  const myResources = resources.filter((resource) => resource.user_id === currentUser.id);
  const liveResources = myResources.filter((resource) => isResourceLive(resource));
  const badges = buildBadges(currentUser.posts_count, currentUser.confirmations_count, currentUser.trust_score);

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-bark/8 bg-stone/80 p-7 shadow-note md:p-8">
        <div className="section-kicker mb-4">Profile</div>
        <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">@{currentUser.username}</h1>
        <p className="mt-5 max-w-[34rem] text-lg leading-8 text-bark-light">
          Profiles turn resource sharing into a reputation system. Reliable posts build trust, increase engagement, and discourage noise.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[26px] border border-bark/8 bg-cream p-5">
            <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Points</div>
            <div className="mt-2 text-3xl font-medium text-bark">{currentUser.points}</div>
          </div>
          <div className="rounded-[26px] border border-bark/8 bg-cream p-5">
            <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Posts</div>
            <div className="mt-2 text-3xl font-medium text-bark">{currentUser.posts_count}</div>
          </div>
          <div className="rounded-[26px] border border-bark/8 bg-cream p-5">
            <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Confirmations</div>
            <div className="mt-2 text-3xl font-medium text-bark">{currentUser.confirmations_count}</div>
          </div>
          <div className="rounded-[26px] border border-bark/8 bg-cream p-5">
            <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Trust score</div>
            <div className="mt-2 text-3xl font-medium text-bark">{currentUser.trust_score}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
          <div className="text-xl font-medium text-bark">Badges earned</div>
          <div className="mt-5 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] border border-bark/8 bg-stone/72 px-5 py-4">
              <div className="flex items-center gap-3 text-bark">
                <ShieldCheck className="h-5 w-5 text-moss" />
                Trusted poster
              </div>
              <div className="mt-2 text-sm text-bark-light">
                High-trust posters are surfaced more clearly to reduce spam and improve confidence.
              </div>
            </div>
            <div className="rounded-[24px] border border-bark/8 bg-stone/72 px-5 py-4">
              <div className="flex items-center gap-3 text-bark">
                <Trophy className="h-5 w-5 text-moss" />
                Monthly leaderboard
              </div>
              <div className="mt-2 text-sm text-bark-light">
                Consistent contributors keep their campus map warm, current, and worth checking.
              </div>
            </div>
            <div className="rounded-[24px] border border-bark/8 bg-stone/72 px-5 py-4">
              <div className="flex items-center gap-3 text-bark">
                <Star className="h-5 w-5 text-moss" />
                Reputation loop
              </div>
              <div className="mt-2 text-sm text-bark-light">
                Accurate posts strengthen your reputation and make students more likely to trust what you share next.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
          <div className="flex items-center justify-between">
            <div className="text-xl font-medium text-bark">Your recent posts</div>
            <Badge variant="verified">{liveResources.length} live</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {myResources.length ? (
              myResources.slice(0, 5).map((resource) => (
                <div key={resource.id} className="rounded-[24px] border border-bark/8 bg-stone/72 px-5 py-4">
                  <div className="text-base font-medium text-bark">{resource.title}</div>
                  <div className="mt-2 text-sm text-bark-light">
                    {resource.building_name} · {resource.still_available_count} confirmations · {resource.gone_count} gone votes
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-bark/8 bg-stone/72 px-5 py-4 text-sm text-bark-light">
                You have not posted yet. Share a resource to start building trust on the map.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
