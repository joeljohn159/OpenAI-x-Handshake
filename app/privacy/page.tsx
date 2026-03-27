import { ChevronLeft } from "lucide-react";

import { TransitionLink } from "@/components/shared/transition-link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="page-shell py-10 md:py-14">
        <TransitionLink href="/" className="inline-flex items-center gap-2 text-sm text-bark-light hover:text-bark">
          <ChevronLeft className="h-4 w-4" />
          Back to landing page
        </TransitionLink>

        <div className="mt-8 max-w-[860px] rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
          <div className="section-kicker mb-4">Privacy</div>
          <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">CampusShare privacy overview</h1>
          <div className="mt-6 space-y-5 text-base leading-8 text-bark-light">
            <p>
              CampusShare stores the minimum information needed to make a community-verified map work: account identity, resource posts, confirmation votes, optional uploaded images, and watch zone preferences.
            </p>
            <p>
              Location is only used to center the map, calculate distance, and help students set a watch zone. The app does not sell user data or use paid AI inference.
            </p>
            <p>
              When Supabase is configured, authentication, storage, and realtime updates are handled through your own project. In demo mode, local state remains in the browser so judges can experience the product without account setup.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
