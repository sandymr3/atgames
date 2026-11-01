"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A silent gameplay loop from the store page. It only fetches and plays while
 * on screen, and with reduced motion it stays on its poster.
 */
export default function FeatureClip({
  slug,
  label,
}: {
  slug: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the element leaves the page mid-load; harmless
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduced]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={`/game/clips/${slug}.webp`}
      aria-label={label}
      width={1170}
      height={658}
      className="aspect-video w-full border border-chalk/10 bg-black object-cover"
    >
      <source src={`/game/clips/${slug}.webm`} type="video/webm; codecs=vp9" />
      <source src={`/game/clips/${slug}.mp4`} type="video/mp4" />
    </video>
  );
}
