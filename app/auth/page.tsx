import { ChevronLeft } from "lucide-react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { TransitionLink } from "@/components/shared/transition-link";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="page-shell py-10 md:py-14">
        <TransitionLink href="/" className="inline-flex items-center gap-2 text-sm text-bark-light hover:text-bark">
          <ChevronLeft className="h-4 w-4" />
          Back to landing page
        </TransitionLink>
        <div className="mt-6">
          <AuthPanel />
        </div>
      </div>
    </main>
  );
}
