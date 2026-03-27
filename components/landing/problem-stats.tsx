"use client";

import { motion } from "framer-motion";

import { CountUp } from "@/components/landing/count-up";
import { landingStats } from "@/lib/mock-data";

export function ProblemStats() {
  return (
    <section id="problem" className="section-space border-y border-bark/8 bg-stone/55">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="max-w-[360px]"
        >
          <div className="section-kicker mb-4">By the numbers</div>
          <h2 className="font-serif text-4xl leading-[1.08] text-bark md:text-5xl">
            A campus can be full of support and still feel invisible.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {landingStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.1 }}
              className="bulletin-note rounded-[28px] p-6"
              style={{ transform: `rotate(${index % 2 === 0 ? "-0.6deg" : "0.6deg"})` }}
            >
              <div className="font-mono text-4xl tracking-[-0.04em] text-bark md:text-5xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-4 text-base leading-7 text-bark-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
