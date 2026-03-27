"use client";

import { motion } from "framer-motion";
import { BellRing, CheckCircle2, Map, Trophy } from "lucide-react";

const features = [
  {
    title: "Real-time map",
    description: "Pins appear the moment someone shares something useful, so the product feels alive instead of stale.",
    icon: Map
  },
  {
    title: "Community verification",
    description: "Still-there and gone votes create a lightweight trust layer that keeps the map dependable.",
    icon: CheckCircle2
  },
  {
    title: "Smart notifications",
    description: "Watch zones surface new resources near your classes without spamming every event across campus.",
    icon: BellRing
  },
  {
    title: "Contribution rewards",
    description: "Points, badges, and the monthly leaderboard reward students who post real, useful information.",
    icon: Trophy
  }
];

export function FeatureGrid() {
  return (
    <section id="features" className="section-space">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="mb-14 max-w-[500px]"
        >
          <div className="section-kicker mb-4">Features</div>
          <h2 className="font-serif text-4xl leading-[1.08] text-bark md:text-5xl">
            Practical product decisions for a problem students feel every week.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.08 }}
                className="rounded-[28px] border border-bark/8 bg-stone px-6 py-7 shadow-note"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-[18px] border border-moss/10 bg-moss-subtle text-moss">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="border-l border-moss/30 pl-4">
                    <h3 className="text-xl font-medium text-bark">{feature.title}</h3>
                    <p className="mt-3 max-w-[34rem] text-base leading-7 text-bark-light">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
