"use client";

import { motion } from "framer-motion";

import { testimonials } from "@/lib/mock-data";

export function TestimonialGrid() {
  return (
    <section className="section-space">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="mb-14 max-w-[520px]"
        >
          <div className="section-kicker mb-4">Social proof</div>
          <h2 className="font-serif text-4xl leading-[1.08] text-bark md:text-5xl">
            The best signal is when students change their route because they trust the map.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.attribution}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.08 }}
              className="rounded-[28px] border border-bark/8 bg-cream p-7 shadow-note"
            >
              <p className="text-lg leading-8 text-bark">“{testimonial.quote}”</p>
              <div className="mt-8 text-sm uppercase tracking-[0.08em] text-bark-light">{testimonial.attribution}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
