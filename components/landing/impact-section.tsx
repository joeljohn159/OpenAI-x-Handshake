"use client";

import { motion } from "framer-motion";

export function ImpactSection() {
  return (
    <section id="about" className="section-space bg-cream">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="rounded-[40px] border border-bark/8 bg-stone/72 p-8 md:p-12"
        >
          <div className="max-w-[860px] font-serif text-4xl leading-[1.05] text-bark md:text-6xl">
            No student should have to choose between a meal and a textbook.
          </div>
          <p className="mt-8 max-w-[760px] text-lg leading-8 text-bark-light">
            CampusShare started with a familiar UNT pattern: free food disappearing in fifteen minutes, students hearing about it an hour too late, and useful supplies sitting unseen in the next building over. We wanted a product that felt credible enough to trust, fast enough to use between classes, and generous enough to make campus resources actually circulate.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
