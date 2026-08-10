"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Teaser slot. Until there is a trailer, this is a facade over the poster —
 * no third-party embed script, no cookies, nothing to load. Drop the iframe in
 * where the placeholder note is and the surrounding chrome still fits.
 */
export default function TrailerFrame() {
  const [armed, setArmed] = useState(false);

  return (
    <figure className="relative">
      <div className="relative aspect-video w-full overflow-hidden border border-chalk/10 bg-black">
        <Image
          src="/game/poster-ta.webp"
          alt="Fourth Shadow teaser still"
          fill
          sizes="(max-width: 1024px) 100vw, 70vw"
          className={`object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            armed ? "scale-[1.04] opacity-45 blur-[2px]" : "opacity-70"
          }`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-black/40" />

        <button
          type="button"
          onClick={() => setArmed((v) => !v)}
          aria-label="Teaser — not yet available"
          className="group absolute inset-0 grid place-items-center"
        >
          <span className="relative grid h-20 w-20 place-items-center rounded-full border border-chalk/35 transition-all duration-500 group-hover:border-blood-lit group-hover:bg-blood/20">
            {/* the ring keeps expanding outward, like a signal nobody answers */}
            <span className="absolute inset-0 animate-ping rounded-full border border-chalk/12" />
            <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] fill-chalk/80">
              <path d="M8 5.14v13.72L19 12 8 5.14Z" />
            </svg>
          </span>
        </button>

        {armed && (
          <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[0.68rem] uppercase tracking-[0.28em] text-chalk/70">
            Teaser drops when the room is finished
          </p>
        )}
      </div>

      <figcaption className="mt-4 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.22em] text-chalk/30">
        <span>Teaser · Coming soon</span>
        <span>நான்காம் நிழல்</span>
      </figcaption>
    </figure>
  );
}
