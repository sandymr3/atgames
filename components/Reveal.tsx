"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** clip-path wipe instead of a plain fade — for headlines */
  wipe?: boolean;
};

/**
 * One reveal primitive for the whole site so the timing language stays
 * consistent: a long expo ease, a short travel, once only.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  wipe = false,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={
        wipe
          ? { clipPath: "inset(0 0 100% 0)", y, opacity: 0 }
          : { y, opacity: 0 }
      }
      whileInView={
        wipe ? { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 } : { y: 0, opacity: 1 }
      }
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
