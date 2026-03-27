import { ChevronLeft, Mail, MapPinned } from "lucide-react";

import { TransitionLink } from "@/components/shared/transition-link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="page-shell py-10 md:py-14">
        <TransitionLink href="/" className="inline-flex items-center gap-2 text-sm text-bark-light hover:text-bark">
          <ChevronLeft className="h-4 w-4" />
          Back to landing page
        </TransitionLink>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[36px] border border-bark/8 bg-stone/80 p-7 shadow-note md:p-8">
            <div className="section-kicker mb-4">Contact</div>
            <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">Get in touch with the team</h1>
            <p className="mt-5 text-lg leading-8 text-bark-light">
              CampusShare is currently positioned as a competition-ready prototype and pilot. Reach out if you want to test it on another campus or review the implementation.
            </p>
          </div>

          <div className="rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
            <div className="space-y-4">
              <div className="rounded-[28px] border border-bark/8 bg-stone/72 p-5">
                <div className="flex items-center gap-3 text-bark">
                  <Mail className="h-5 w-5 text-moss" />
                  hello@campusshare.app
                </div>
                <div className="mt-2 text-sm text-bark-light">
                  Product questions, campus pilots, and implementation walkthroughs.
                </div>
              </div>

              <div className="rounded-[28px] border border-bark/8 bg-stone/72 p-5">
                <div className="flex items-center gap-3 text-bark">
                  <MapPinned className="h-5 w-5 text-moss" />
                  University of North Texas pilot
                </div>
                <div className="mt-2 text-sm text-bark-light">
                  UNT is the origin story and seed campus, but the demo map can also generate nearby sample activity for the viewer location.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
