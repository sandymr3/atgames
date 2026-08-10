"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import TamilParticleBackground from "@/components/TamilParticleBackground";

/* ============================================================================
   The classroom, taken apart.

   The source art is one flat 5760x4320 render. tools/prepare_assets.py cuts
   the chalk title, the silhouette and the handprint out of it and *erases them
   from the plate* — so these planes are not sliding over baked-in copies of
   themselves, which is what makes fake parallax read as a printing error.

   Every plane is positioned as a percentage of the plate, inside one box that
   emulates object-cover, so the registration holds at any viewport.
   ========================================================================== */

const PLANES = {
  // left / top / width / height, as fractions of the 5760x4320 plate
  ghost: { l: 13.194, t: 28.704, w: 22.917, h: 41.204 },
  title: { l: 26.042, t: 33.565, w: 47.569, h: 33.102 },
  hand: { l: 59.028, t: 24.537, w: 8.16, h: 13.889 },
} as const;

const pct = (p: { l: number; t: number; w: number; h: number }) => ({
  left: `${p.l}%`,
  top: `${p.t}%`,
  width: `${p.w}%`,
  height: `${p.h}%`,
});

export default function ShadowHero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [lang, setLang] = useState<"ta" | "en">("ta");

  useGSAP(
    () => {
      if (reduced) return;

      // Pin the frame and pull the planes apart underneath it: the viewer's
      // eye stays put while the room opens up. Rates are deliberately far
      // apart — subtle parallax just looks like a rendering wobble.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=125%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Viewport units, not yPercent: yPercent is relative to each element's
      // own height, so the small handprint would travel fewer pixels than the
      // huge title and the depth order would come out backwards.
      tl.to("[data-plane='plate']", { y: "-3vh", scale: 1.13, ease: "none" }, 0)
        .to("[data-plane='ghost']", { y: "-8vh", ease: "none" }, 0)
        .to("[data-plane='title']", { y: "-14vh", ease: "none" }, 0)
        .to("[data-plane='hand']", { y: "-19vh", ease: "none" }, 0)
        .to("[data-fx='blood']", { opacity: 0.7, ease: "none" }, 0)
        .to("[data-fx='dark']", { opacity: 0.9, ease: "none" }, 0)
        .to("[data-hud]", { opacity: 0, y: -40, ease: "none" }, 0);

      // The silhouette breathes on its own clock, unhooked from scroll. It
      // lives on an inner node so this scale never fights the scrubbed y.
      gsap.to("[data-breathe]", {
        scale: 1.04,
        opacity: 0.84,
        duration: 7.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      className="relative h-[100svh] overflow-hidden bg-[#050404]"
    >
      {/* object-cover, hand-rolled, so the planes stay registered to the plate */}
      <div className="absolute left-1/2 top-1/2 aspect-4/3 w-[max(100vw,133.4svh)] -translate-x-1/2 -translate-y-1/2">
        <div data-plane="plate" className="absolute inset-0 will-change-transform">
          {/* unoptimized on purpose: tools/prepare_assets.py already emits
              these at web size and quality, and re-encoding a 2560px WebP
              through the image optimizer stalls the hero on first paint. */}
          <Image
            src="/game/scene-plate.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="120vw"
            className="object-cover brightness-[1.04] contrast-[1.1] saturate-[0.88]"
          />
        </div>

        <div
          data-plane="ghost"
          className="absolute will-change-transform"
          style={pct(PLANES.ghost)}
        >
          <div data-breathe className="absolute inset-0">
            <Image
              src="/game/ghost.png"
              alt=""
              fill
              unoptimized
              sizes="30vw"
              className="object-contain"
            />
          </div>
        </div>

        <div
          data-plane="hand"
          className="absolute will-change-transform"
          style={pct(PLANES.hand)}
        >
          <Image
            src="/game/handprint.png"
            alt=""
            fill
            unoptimized
            sizes="12vw"
            className="object-contain"
          />
        </div>

        {/* the chalk logotype, in whichever language is selected */}
        <div
          data-plane="title"
          className="absolute will-change-transform"
          style={pct(PLANES.title)}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={lang}
              className="absolute inset-0"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={lang === "ta" ? "/game/title-ta.webp" : "/game/title-en.webp"}
                alt={lang === "ta" ? "நான்காம் நிழல்" : "Fourth Shadow"}
                fill
                priority
                unoptimized
                sizes="60vw"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* the failing tube light, blown out over the ceiling fitting */}
        <div
          aria-hidden
          className="flicker pointer-events-none absolute left-1/2 top-[2%] h-[22%] w-[40%] -translate-x-1/2 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse at 50% 32%, rgba(255,236,196,0.26) 0%, rgba(255,190,110,0.08) 36%, transparent 68%)",
          }}
        />

        {/* the room is lit by one failing tube: everything away from it falls off */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(78% 62% at 50% 26%, transparent 0%, rgba(4,3,3,0.35) 58%, rgba(4,3,3,0.72) 100%)",
          }}
        />
      </div>

      {/* chalk dust — the studio's letter field, inverted */}
      <TamilParticleBackground
        mode="chalk"
        density={0.5}
        speed={0.7}
        opacity={0.55}
        interactive={false}
      />

      {/* blood bloom, ramped by scroll */}
      {/* Screen, not multiply: on a scene this dark, multiplying red just
          removes what little is left. Adding red light is the horror move. */}
      <div
        aria-hidden
        data-fx="blood"
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
        style={{
          background:
            "radial-gradient(120% 95% at 78% 92%, rgba(140,20,24,0.62) 0%, rgba(70,8,12,0.34) 40%, transparent 74%)",
        }}
      />
      <div
        aria-hidden
        data-fx="dark"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(105% 78% at 50% 46%, transparent 22%, rgba(0,0,0,0.72) 72%, #000 100%)",
        }}
      />

      {/* scrim so the fixed nav and the HUD never sit on the blown-out wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-linear-to-b from-black/75 via-black/30 to-transparent"
      />

      {/* ── HUD ─────────────────────────────────────────────────────── */}
      <div
        data-hud
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8"
      >
        <div className="flex items-start justify-between pt-[74px]">
          <div>
            <p className="tamil text-[0.85rem] tracking-[0.2em] text-chalk/70">
              வகுப்பு: ௭-அ
            </p>
            <p className="mt-2 text-[0.62rem] uppercase tracking-[0.32em] text-chalk/35">
              Class 7-A · Attendance 15
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-px border border-chalk/15 bg-black/30 backdrop-blur-sm">
            {(["ta", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] transition-colors duration-400 ${
                  lang === code
                    ? "bg-chalk/90 text-[#0b0908]"
                    : "text-chalk/50 hover:text-chalk"
                }`}
              >
                {code === "ta" ? "தமிழ்" : "EN"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p className="max-w-xs text-[0.68rem] uppercase leading-relaxed tracking-[0.2em] text-chalk/40">
            First-person psychological horror · 2026
          </p>
          <p className="hidden text-[0.62rem] uppercase tracking-[0.32em] text-chalk/35 sm:block">
            Scroll into the room
          </p>
        </div>
      </div>
    </section>
  );
}
