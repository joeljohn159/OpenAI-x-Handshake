import { ChevronLeft } from "lucide-react";

import { LeaderboardPanel } from "@/components/leaderboard/leaderboard-panel";
import { TransitionLink } from "@/components/shared/transition-link";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="page-shell py-10 md:py-14">
        <TransitionLink href="/map" className="inline-flex items-center gap-2 text-sm text-bark-light hover:text-bark">
          <ChevronLeft className="h-4 w-4" />
          Back to map
        </TransitionLink>
        <div className="mt-6">
          <LeaderboardPanel />
        </div>
      </div>
    </main>
  );
}
