import { BrandLogo } from "@/components/shared/brand-logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex items-center gap-4 rounded-full border border-bark/8 bg-stone/78 px-5 py-4 shadow-soft">
        <BrandLogo variant="mark" />
        <div className="text-sm text-bark-light">Loading CampusShare</div>
      </div>
    </div>
  );
}
