"use client";

import { motion } from "framer-motion";
import { CalendarFold, CheckCheck, MapPinned } from "lucide-react";

const steps = [
  {
    title: "Someone shares",
    description: "A student drops a pin for free pizza, a pantry restock, or leftover event materials in under a minute.",
    icon: CalendarFold,
    className: "md:translate-y-10"
  },
  {
    title: "Your campus verifies",
    description: "The trust layer keeps posts honest with live still-there and gone confirmations before anyone walks across campus.",
    icon: CheckCheck,
    className: "md:-translate-y-6"
  },
  {
    title: "You grab it",
    description: "Students filter by category, distance, and freshness so the map feels useful instead of noisy.",
    icon: MapPinned,
    className: "md:translate-y-14"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-space">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="mb-14 max-w-[600px]"
        >
          <div className="section-kicker mb-4">How it works</div>
          <h2 className="font-serif text-4xl leading-[1.08] text-bark md:text-5xl">
            Built for fast campus moments, not for perfect planning.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.08 }}
                className={`relative overflow-hidden rounded-[30px] border border-bark/8 bg-cream p-7 shadow-note ${step.className}`}
              >
                <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-[22px] bg-moss-subtle text-moss">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-medium text-bark">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-bark-light">{step.description}</p>
                {index < steps.length - 1 ? (
                  <div className="pointer-events-none absolute right-[-18px] top-16 hidden h-px w-14 border-t border-dashed border-bark/20 md:block" />
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
