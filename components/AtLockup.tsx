"use client";

import { motion, useReducedMotion } from "motion/react";
import { DOT, LOCKUP_VIEWBOX, MARK, WORDMARK } from "@/lib/lockup";

/**
 * The studio lockup, inlined as real SVG so each piece can be animated:
 * the mark draws itself in as a stroke, floods with the ember gradient, then
 * the six wordmark letters wipe up one after another and the dot inside the
 * "G" drops in last.
 */
export default function AtLockup({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      role="img"
      aria-label="AT Games"
      className={className}
    >
      <defs>
        <linearGradient
          id="lockup-ember"
          gradientUnits="userSpaceOnUse"
          x1="343"
          y1="179"
          x2="447"
          y2="282"
        >
          <stop offset="0" stopColor="#f2a020" />
          <stop offset=".48" stopColor="#ec6c24" />
          <stop offset=".8" stopColor="#d44426" />
          <stop offset="1" stopColor="#c83c27" />
        </linearGradient>
        <linearGradient
          id="lockup-ember-sm"
          gradientUnits="userSpaceOnUse"
          x1="377"
          y1="296"
          x2="414"
          y2="333"
        >
          <stop offset="0" stopColor="#f2a020" />
          <stop offset=".55" stopColor="#ec6c24" />
          <stop offset="1" stopColor="#c83c27" />
        </linearGradient>
      </defs>

      {/* Every animated piece is wrapped in a <g>. The outlines carry a
          `transform` *attribute* from the source artwork, and a CSS transform
          on the same element would override it outright — the letters would
          silently collapse to the origin. Transform the group, never the path.
          (pathLength is safe: it compiles to stroke-dash, not a transform.) */}
      {!reduced && (
        <motion.path
          d={MARK.d}
          transform={MARK.transform}
          fill="none"
          stroke="url(#lockup-ember)"
          strokeWidth={0.7}
          initial={{ pathLength: 0, opacity: 0.9 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{
            pathLength: { duration: 1.5, ease: "easeInOut" },
            opacity: { delay: 1.35, duration: 0.5 },
          }}
        />
      )}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "395px 230px" }}
        transition={{ duration: 1.1, delay: 0.72, ease }}
      >
        <path d={MARK.d} transform={MARK.transform} fill="url(#lockup-ember)" />
      </motion.g>

      <g>
        {WORDMARK.map((letter, i) => (
          <motion.g
            key={letter.id}
            initial={reduced ? false : { opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 + i * 0.075, ease }}
          >
            <path
              id={`wm-${letter.id}`}
              d={letter.d}
              transform={letter.transform}
              fill="#f2eee9"
            />
          </motion.g>
        ))}
      </g>

      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "395px 314px" }}
        transition={{ duration: 0.7, delay: 1.72, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <path d={DOT.d} transform={DOT.transform} fill="url(#lockup-ember-sm)" />
      </motion.g>
    </svg>
  );
}
