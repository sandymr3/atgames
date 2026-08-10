"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { KURAL } from "@/lib/site";

/* The reveal is driven from the *container*, never from the clipped line
   itself. A child that starts translated out of an overflow-hidden parent has
   zero intersection area, so its own whileInView can never fire — it would
   stay invisible forever. */
const group: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.15 } },
};

const line: Variants = {
  hide: { y: "108%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
  },
};

const gloss: Variants = {
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, delay: 0.55 } },
};

export default function KuralBlock({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative"
      variants={group}
      initial={reduced ? false : "hide"}
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
    >
      <div className="flex items-center gap-4">
        <span className="tamil text-sm text-ember">௪௬௭</span>
        <span className="h-px flex-1 bg-linear-to-r from-ember/60 via-white/10 to-transparent" />
        <span className="tamil text-[0.8rem] text-ash-400">{KURAL.chapter}</span>
      </div>

      <div className={compact ? "mt-8" : "mt-12"}>
        {KURAL.lines.map((text) => (
          <span key={text} className="block overflow-hidden py-[0.12em]">
            <motion.span
              variants={line}
              className={`tamil block leading-[1.42] text-bone ${
                compact
                  ? "text-[clamp(1.15rem,2.6vw,1.9rem)]"
                  : "text-[clamp(1.4rem,4.2vw,3.2rem)]"
              }`}
            >
              {text}
            </motion.span>
          </span>
        ))}
      </div>

      <motion.div variants={gloss} className={compact ? "mt-6" : "mt-10"}>
        <p className="max-w-xl text-sm italic leading-relaxed text-ash-300">
          {KURAL.translit}
        </p>
        <p className="mt-3 max-w-xl text-[0.82rem] leading-relaxed text-ash-400">
          {KURAL.meaning}
        </p>
      </motion.div>
    </motion.div>
  );
}
