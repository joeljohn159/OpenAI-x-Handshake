"use client";

import { motion } from "framer-motion";
import { ArrowRight, ScanSearch } from "lucide-react";

import { MapPreviewMockup } from "@/components/landing/map-preview-mockup";
import { TransitionLink } from "@/components/shared/transition-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="section-space overflow-hidden">
      <div className="page-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="max-w-[560px]"
        >
          <div className="section-kicker mb-5">Community-powered campus utility</div>
          <h1 className="editorial-title max-w-[12ch]">
            Your campus has more to give than you think.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-8 text-bark-light">
            Students miss free meals, spare textbooks, pantry restocks, and shared supplies every day because the signal never reaches them in time.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <TransitionLink href="/map" className={buttonVariants({ size: "lg" })}>
              Find free resources
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>
            <TransitionLink href="/post" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
              Share with your campus
              <ScanSearch className="h-4 w-4" />
            </TransitionLink>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 text-sm text-bark-light">
            <div className="rounded-full border border-bark/8 bg-stone/80 px-4 py-2">Piloted from UNT, adaptable to any campus</div>
            <div className="rounded-full border border-bark/8 bg-stone/80 px-4 py-2">Verification layer for trust</div>
            <div className="rounded-full border border-bark/8 bg-stone/80 px-4 py-2">Zero-cost infrastructure stack</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.15 }}
          className="lg:translate-x-8"
        >
          <MapPreviewMockup />
        </motion.div>
      </div>
    </section>
  );
}
