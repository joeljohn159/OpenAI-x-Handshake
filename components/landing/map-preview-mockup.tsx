"use client";

import { motion } from "framer-motion";
import { Backpack, CalendarDays, PackageOpen, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const pins = [
  {
    id: "food-1",
    label: "Union Courtyard",
    title: "Free pizza",
    left: "26%",
    top: "38%",
    color: "#2D6A4F",
    bg: "#D8F3DC",
    icon: UtensilsCrossed
  },
  {
    id: "event-1",
    label: "Business Building",
    title: "Career fair leftovers",
    left: "58%",
    top: "28%",
    color: "#E76F51",
    bg: "rgba(231, 111, 81, 0.16)",
    icon: CalendarDays
  },
  {
    id: "pantry-1",
    label: "Maple Hall",
    title: "Pantry open",
    left: "61%",
    top: "60%",
    color: "#1E3A5F",
    bg: "rgba(30, 58, 95, 0.15)",
    icon: PackageOpen
  },
  {
    id: "supplies-1",
    label: "Willis Library",
    title: "Free textbooks",
    left: "38%",
    top: "65%",
    color: "#D4A843",
    bg: "rgba(212, 168, 67, 0.16)",
    icon: Backpack
  }
];

export function MapPreviewMockup() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-bark/10 bg-stone shadow-soft">
      <div className="absolute inset-0 bg-grain opacity-90" />
      <div className="absolute inset-0 map-grid opacity-60" />
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 1000 680"
        fill="none"
      >
        <path d="M80 550C180 470 260 500 320 450C410 374 470 410 548 360C630 306 735 326 920 162" stroke="#CFC6BB" strokeWidth="18" strokeLinecap="round" />
        <path d="M142 112C184 150 252 182 372 212C490 242 568 220 654 258C732 292 814 364 872 466" stroke="#DDD5C8" strokeWidth="12" strokeLinecap="round" />
        <path d="M166 648C230 576 280 538 380 520C490 500 580 530 640 484C702 438 788 320 824 250" stroke="#E5DDD0" strokeWidth="10" strokeLinecap="round" />
      </svg>

      <div className="relative flex min-h-[520px] flex-col justify-between overflow-hidden p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="rounded-full border border-bark/8 bg-cream/90 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bark-light">
            Live near campus
          </div>
          <Badge variant="verified" className="border-none bg-moss/12 text-moss">
            Community verified
          </Badge>
        </div>

        <div className="absolute inset-x-6 top-20 rounded-[28px] border border-white/40 bg-cream/82 p-4 shadow-soft backdrop-blur-sm md:left-auto md:right-8 md:w-[280px]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-bark">Free pizza from student senate meeting</div>
              <div className="text-sm text-bark-light">Union Courtyard · 12 min ago</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-moss-subtle text-moss">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-3xl border border-moss/10 bg-stone/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-bark">
              <span className="trust-dot bg-moss" />
              Verified by 5 people
            </div>
            <p className="text-sm text-bark-light">
              Last confirmed 3 min ago. Countdown stays live so students only walk when the odds are good.
            </p>
          </div>
        </div>

        <div className="relative h-[360px]">
          <div className="absolute bottom-4 left-4 rounded-[24px] border border-bark/8 bg-cream/84 px-4 py-3 shadow-note backdrop-blur-sm">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-bark-light">Watch zone active</div>
            <div className="mt-1 text-sm text-bark">0.5 mile around Willis Library</div>
          </div>

          {pins.map((pin, index) => {
            const Icon = pin.icon;

            return (
              <motion.div
                key={pin.id}
                initial={{ opacity: 0, y: -24, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: index * 0.12 }}
                className="absolute"
                style={{ left: pin.left, top: pin.top }}
              >
                <div className="relative">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-[22px] border shadow-note"
                    style={{
                      backgroundColor: pin.bg,
                      borderColor: `${pin.color}33`
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: pin.color }} />
                  </div>
                  <div
                    className="absolute left-1/2 top-[48px] h-4 w-4 -translate-x-1/2 rotate-45 rounded-[4px]"
                    style={{ backgroundColor: pin.bg }}
                  />
                  <div className="absolute left-1/2 mt-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-bark px-3 py-1 text-[11px] tracking-[0.04em] text-cream shadow-note">
                    {pin.title}
                  </div>
                  <div className="absolute left-1/2 mt-14 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-bark-light">
                    {pin.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
