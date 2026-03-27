import { BrandLogo } from "@/components/shared/brand-logo";
import { TransitionLink } from "@/components/shared/transition-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-bark/8 bg-stone/70">
      <div className="page-shell flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo href="/" variant="mark" />
            <div>
              <div className="text-sm font-medium text-bark">CampusShare</div>
              <div className="text-sm text-bark-light">Built for students who move fast and need trusted information.</div>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-bark-light">
            <TransitionLink href="/about" className="hover:text-bark">
              About
            </TransitionLink>
            <TransitionLink href="/privacy" className="hover:text-bark">
              Privacy
            </TransitionLink>
            <TransitionLink href="/contact" className="hover:text-bark">
              Contact
            </TransitionLink>
          </div>
        </div>
        <p className="text-sm text-bark-faint">© 2026 CampusShare. Designed for the OpenAI x Handshake Codex Creator Challenge.</p>
      </div>
    </footer>
  );
}
