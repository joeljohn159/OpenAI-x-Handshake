import { ChevronLeft } from "lucide-react";

import { PostFlow } from "@/components/post/post-flow";
import { TransitionLink } from "@/components/shared/transition-link";

export default function PostPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="page-shell py-10 md:py-14">
        <TransitionLink href="/map" className="inline-flex items-center gap-2 text-sm text-bark-light hover:text-bark">
          <ChevronLeft className="h-4 w-4" />
          Back to map
        </TransitionLink>
        <div className="mt-6">
          <PostFlow />
        </div>
      </div>
    </main>
  );
}
