"use client";

import { useEffect, useRef } from "react";

/**
 * A thin ember ring trailing the cursor. Visibility is a CSS concern — coarse
 * pointers and reduced-motion users never see it — so the component holds no
 * state at all; it just moves a node on rAF.
 */
export default function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as HTMLElement | null;
      const hot = !!el?.closest("a, button, [data-cursor='hot']");
      ref.current?.classList.toggle("is-hot", hot);
    };

    const tick = () => {
      // lag the ring behind the true pointer — the delay is the whole effect
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        ref.current.style.opacity = "1";
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-8 w-8 rounded-full border border-ember/60 transition-[width,height,background-color,border-color] duration-300 ease-out motion-reduce:hidden md:block [&.is-hot]:h-14 [&.is-hot]:w-14 [&.is-hot]:border-ember [&.is-hot]:bg-ember/10"
    />
  );
}
