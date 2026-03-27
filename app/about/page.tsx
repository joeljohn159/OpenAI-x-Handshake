import { ChevronLeft } from "lucide-react";

import { TransitionLink } from "@/components/shared/transition-link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="page-shell py-10 md:py-14">
        <TransitionLink href="/" className="inline-flex items-center gap-2 text-sm text-bark-light hover:text-bark">
          <ChevronLeft className="h-4 w-4" />
          Back to landing page
        </TransitionLink>

        <div className="mt-8 max-w-[920px] rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
          <div className="section-kicker mb-4">About</div>
          <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">Why CampusShare exists</h1>
          <div className="mt-6 space-y-5 text-base leading-8 text-bark-light">
            <p>
              CampusShare is built around a simple failure on most campuses: help is present, but discoverability is weak. Free food gets posted in a group chat too late, spare textbooks never reach the right student, and resource shelves stay invisible unless someone already knows where to look.
            </p>
            <p>
              The product focuses on University of North Texas as a concrete pilot, but the structure is designed to scale to any campus where students need faster, more trustworthy ways to find what their community is already willing to share.
            </p>
            <p>
              That is why the app combines a real-time map, community verification, watch zones, and contribution-based trust instead of stopping at a basic bulletin board.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
