"use client";

import { Medal, ShieldCheck, Sparkles, Trophy } from "lucide-react";

import { useCampusShare } from "@/components/providers/campusshare-provider";
import { Badge } from "@/components/ui/badge";

const rankStyles = [
  "bg-[#E8D5A5]",
  "bg-[#D7DDE4]",
  "bg-[#E6C8B7]"
];

export function LeaderboardPanel() {
  const { leaderboard } = useCampusShare();

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-bark/8 bg-stone/80 p-7 shadow-note md:p-8">
        <div className="section-kicker mb-4">Top contributors this month</div>
        <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">
          Reward the students who make campus information useful.
        </h1>
        <p className="mt-5 max-w-[44rem] text-lg leading-8 text-bark-light">
          Every post, confirmation, and verified share adds up. The leaderboard turns generosity into a campus habit instead of a hidden favor.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <div key={entry.id} className="rounded-[32px] border border-bark/8 bg-cream p-6 shadow-note">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-[18px] ${rankStyles[index]} text-bark`}>
              <Medal className="h-5 w-5" />
            </div>
            <div className="mt-5 text-2xl font-medium text-bark">#{index + 1} @{entry.username}</div>
            <div className="mt-2 text-sm text-bark-light">
              {entry.points} points · {entry.posts_count} posts · {entry.confirmations_count} confirmations
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.badges.map((badge) => (
                <Badge key={badge} variant="outline">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="flex flex-col gap-4 rounded-[24px] border border-bark/8 bg-stone/72 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream font-mono text-sm text-bark">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-base font-medium text-bark">@{entry.username}</div>
                    <div className="text-sm text-bark-light">
                      {entry.posts_count} posts · {entry.confirmations_count} confirmations · {entry.trust_score} trust
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-medium text-bark">{entry.points}</div>
                    <div className="text-xs uppercase tracking-[0.12em] text-bark-light">Points</div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {entry.badges.slice(0, 2).map((badge) => (
                      <Badge key={badge} variant="default">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-[30px] border border-bark/8 bg-stone/72 p-5">
            <div className="text-lg font-medium text-bark">Badge ladder</div>
            <div className="space-y-3">
              <div className="rounded-[22px] border border-bark/8 bg-cream px-4 py-4">
                <div className="flex items-center gap-3 text-bark">
                  <Sparkles className="h-5 w-5 text-moss" />
                  First Post
                </div>
                <div className="mt-2 text-sm text-bark-light">Awarded when a student shares their first real resource.</div>
              </div>
              <div className="rounded-[22px] border border-bark/8 bg-cream px-4 py-4">
                <div className="flex items-center gap-3 text-bark">
                  <Trophy className="h-5 w-5 text-moss" />
                  Food Hero
                </div>
                <div className="mt-2 text-sm text-bark-light">Awarded after 10 posts that help keep food moving across campus.</div>
              </div>
              <div className="rounded-[22px] border border-bark/8 bg-cream px-4 py-4">
                <div className="flex items-center gap-3 text-bark">
                  <ShieldCheck className="h-5 w-5 text-moss" />
                  Reliable Reporter
                </div>
                <div className="mt-2 text-sm text-bark-light">Awarded after 20 confirmations that strengthen the trust system.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
