"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const shot = (i: number) => `/game/shots/shot-${String(i + 1).padStart(2, "0")}`;

/**
 * Store screenshots with a lightbox. A native <dialog> gives us the top layer,
 * the focus trap, Esc and focus return for free. The images are already sized
 * by tools/prepare_assets.py, hence unoptimized.
 */
export default function ScreenshotGallery({
  captions,
}: {
  captions: readonly string[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

  const step = (by: number) =>
    setOpen((i) =>
      i === null ? i : (i + by + captions.length) % captions.length,
    );

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {captions.map((caption, i) => (
          <li key={caption}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View screenshot: ${caption}`}
              className="group relative block aspect-video w-full overflow-hidden border border-chalk/10 transition-colors duration-500 hover:border-blood-lit"
            >
              <Image
                src={`${shot(i)}-sm.webp`}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Screenshot viewer"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-black/90 sm:p-8"
      >
        {open !== null && (
          <figure className="w-[min(100%,calc((100svh-9rem)*16/9))] min-w-[min(calc(100vw-2rem),calc((100svh-9rem)*16/9))]">
            <div className="relative aspect-video border border-chalk/15 bg-black">
              <Image
                src={`${shot(open)}.webp`}
                alt={captions[open]}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-[0.72rem] text-chalk/60">
              <span>{captions[open]}</span>
              <span className="shrink-0 tabular-nums">
                {open + 1} / {captions.length}
              </span>
            </figcaption>
            <div className="mt-4 flex justify-center gap-3">
              {[
                { label: "Previous", glyph: "←", by: -1 },
                { label: "Next", glyph: "→", by: 1 },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => step(b.by)}
                  aria-label={`${b.label} screenshot`}
                  className="h-10 w-12 border border-chalk/20 text-chalk/80 transition-colors duration-300 hover:border-blood-lit"
                >
                  {b.glyph}
                </button>
              ))}
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="h-10 border border-chalk/20 px-5 text-[0.66rem] uppercase tracking-[0.22em] text-chalk/80 transition-colors duration-300 hover:border-blood-lit"
              >
                Close
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
