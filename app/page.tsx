import { FeatureGrid } from "@/components/landing/feature-grid";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ImpactSection } from "@/components/landing/impact-section";
import { ProblemStats } from "@/components/landing/problem-stats";
import { TestimonialGrid } from "@/components/landing/testimonial-grid";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <ProblemStats />
      <HowItWorks />
      <FeatureGrid />
      <ImpactSection />
      <TestimonialGrid />
      <SiteFooter />
    </main>
  );
}
