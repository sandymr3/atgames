"use client";

import { useEffect, useRef } from "react";

/* ============================================================================
   TamilParticleBackground

   An ambient field of Tamil letterforms drifting behind the page. Two moods
   from one system:

     mode="ember"  — studio pages. Letters rise and rotate lazily in the brand
                     ember ramp, and shove away from the cursor.
     mode="chalk"  — Fourth Shadow. The same field inverted: chalk dust falling
                     through a dark classroom, no rotation, no interaction.

   Three implementation notes carry most of the quality here:

   1. The Tamil webfont must be *loaded* before the first draw. Canvas silently
      falls back to a font with no Tamil coverage and you get a screenful of
      tofu boxes — with no error anywhere.
   2. Glyphs are pre-rendered once into an offscreen atlas and blitted with
      drawImage. Calling fillText for every particle every frame is an order of
      magnitude more expensive for identical output.
   3. Cursor repulsion is a *displacement field*, not a force on velocity. Each
      particle carries an offset that springs back to zero, so the field can be
      pushed around indefinitely without the drift ever blowing out.
   ========================================================================== */

/** உயிர் எழுத்து, common மெய்/உயிர்மெய், and Tamil numerals. */
const TAMIL_GLYPHS = [
  "அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ", "ஃ",
  "க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந", "ப", "ம",
  "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன",
  "கா", "தி", "நி", "மு", "பு", "ளி", "ழு", "றை",
  "௧", "௨", "௩",
];

const PALETTES = {
  ember: ["#f2a020", "#ec6c24", "#d44426", "#f2eee9", "#857f8d"],
  chalk: ["#e8e3d8", "#cfc9bd", "#9c968c", "#b3702a", "#7e1216"],
} as const;

type Mode = keyof typeof PALETTES;

type Particle = {
  glyph: number;
  colour: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** depth 0.15 (far, small, slow, faint) .. 1 (near) */
  z: number;
  rot: number;
  vr: number;
  life: number;
  maxLife: number;
  /** cursor displacement, springs back to 0 */
  ox: number;
  oy: number;
};

export type TamilParticleBackgroundProps = {
  mode?: Mode;
  /** multiplier on the auto density derived from viewport area */
  density?: number;
  /** multiplier on drift speed */
  speed?: number;
  /** cursor repulsion (always off for reduced motion) */
  interactive?: boolean;
  /** peak opacity of the whole field */
  opacity?: number;
  /** cap the redraw rate; drifting glyphs read identically at 30 and leave
      the main thread free for a scrubbed scroll timeline elsewhere */
  fps?: number;
  className?: string;
};

const ATLAS_SIZE = 128;
const REPEL_RADIUS = 170;

export default function TamilParticleBackground({
  mode = "ember",
  density = 1,
  speed = 1,
  interactive = true,
  opacity = 1,
  fps = 60,
  className = "",
}: TamilParticleBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = PALETTES[mode];

    let width = 0;
    let height = 0;
    let dpr = 1;
    const particles: Particle[] = [];
    let atlas: HTMLCanvasElement[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;
    let onScreen = true;
    let disposed = false;

    // pointer, lerped toward the raw position so the field never snaps
    let px = -9999;
    let py = -9999;
    let tx = -9999;
    let ty = -9999;

    /* ---------------------------------------------------------------- atlas */
    // One canvas per (glyph, colour) pair, drawn once. Everything after this
    // is a transform + drawImage, which the compositor handles happily.
    function buildAtlas() {
      atlas = [];
      for (const glyph of TAMIL_GLYPHS) {
        for (const colour of palette) {
          const c = document.createElement("canvas");
          c.width = ATLAS_SIZE;
          c.height = ATLAS_SIZE;
          const g = c.getContext("2d")!;
          g.font = `500 ${ATLAS_SIZE * 0.72}px "Noto Serif Tamil", "Latha", serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillStyle = colour;
          g.fillText(glyph, ATLAS_SIZE / 2, ATLAS_SIZE / 2);
          atlas.push(c);
        }
      }
    }

    const atlasIndex = (p: Particle) => p.glyph * palette.length + p.colour;

    /* ------------------------------------------------------------ particles */
    function spawn(seeded: boolean): Particle {
      const z = 0.15 + Math.random() ** 1.7 * 0.85;
      const maxLife = 9000 + Math.random() * 14000;
      const falling = mode === "chalk";
      return {
        glyph: (Math.random() * TAMIL_GLYPHS.length) | 0,
        colour: pickColour(),
        x: Math.random() * width,
        // Chalk dust enters from above; ember letters seed anywhere and rise.
        y: seeded
          ? Math.random() * height
          : falling
            ? -80
            : height + 80,
        vx: (Math.random() - 0.5) * 0.05 * z * speed,
        vy: (falling ? 1 : -1) * (0.012 + Math.random() * 0.03) * z * speed,
        z,
        rot: (Math.random() - 0.5) * (falling ? 0.5 : 1.1),
        vr: falling ? 0 : (Math.random() - 0.5) * 0.00012,
        life: seeded ? Math.random() * maxLife : 0,
        maxLife,
        ox: 0,
        oy: 0,
      };
    }

    // Mostly neutral with ember punctuation. A field that is majority-orange
    // stops reading as atmosphere and starts competing with the logo.
    function pickColour() {
      const r = Math.random();
      if (r < 0.2) return 0;
      if (r < 0.4) return 1;
      if (r < 0.52) return 2;
      if (r < 0.74) return 3;
      return 4;
    }

    function targetCount() {
      const area = width * height;
      const base = Math.min(96, Math.round(area / 15500));
      const mobile = width < 720 ? 0.5 : 1;
      return Math.max(12, Math.round(base * density * mobile));
    }

    function resize() {
      const rect = host!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const want = targetCount();
      while (particles.length < want) particles.push(spawn(true));
      if (particles.length > want) particles.length = want;
    }

    /* ----------------------------------------------------------------- draw */
    const minFrame = 1000 / fps - 1;

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!visible || !onScreen) {
        last = now;
        return;
      }
      // Skip the frame entirely when we're ahead of the cap. Cheaper than
      // drawing and throwing it away, and it hands the slot back to whatever
      // else wants the main thread.
      if (now - last < minFrame) return;
      // Clamp dt so restoring a backgrounded tab doesn't teleport the field.
      const dt = Math.min(now - last || 16, 48);
      last = now;

      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;

      ctx!.clearRect(0, 0, width, height);

      const parallaxX = interactive && px > -9000 ? (px - width / 2) * 0.02 : 0;
      const parallaxY = interactive && py > -9000 ? (py - height / 2) * 0.02 : 0;

      for (const p of particles) {
        if (!reduced) {
          p.life += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
        }

        // wrap horizontally, recycle when spent or past the far edge
        if (p.x < -120) p.x = width + 100;
        if (p.x > width + 120) p.x = -100;
        const gone =
          p.life > p.maxLife ||
          (mode === "chalk" ? p.y > height + 120 : p.y < -120);
        if (gone && !reduced) {
          Object.assign(p, spawn(false));
          continue;
        }

        if (interactive && !reduced) {
          const dx = p.x + p.ox - px;
          const dy = p.y + p.oy - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            // squared falloff: a firm shove up close, nothing at the rim
            const f = (1 - d / REPEL_RADIUS) ** 2 * 34 * p.z;
            p.ox += (dx / d) * f * (dt / 16);
            p.oy += (dy / d) * f * (dt / 16);
          }
          // spring home
          p.ox -= p.ox * 0.06 * (dt / 16);
          p.oy -= p.oy * 0.06 * (dt / 16);
        }

        // Fade in over the first 12% of life and out over the last 22%, so
        // nothing ever pops into or out of existence.
        const t = p.life / p.maxLife;
        const fade = reduced
          ? 0.5
          : Math.min(1, t / 0.12) * Math.min(1, (1 - t) / 0.22);
        const alpha = fade * (0.04 + p.z * 0.2) * opacity;
        if (alpha <= 0.004) continue;

        const size = (13 + p.z * 44) * (mode === "chalk" ? 0.7 : 1);
        const img = atlas[atlasIndex(p)];
        if (!img) continue;

        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.translate(
          p.x + p.ox + parallaxX * p.z,
          p.y + p.oy + parallaxY * p.z,
        );
        ctx!.rotate(p.rot);
        ctx!.drawImage(img, -size / 2, -size / 2, size, size);
        ctx!.restore();
      }
    }

    /* --------------------------------------------------------------- wiring */
    const onPointer = (e: PointerEvent) => {
      const rect = host!.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (px < -9000) {
        px = tx;
        py = ty;
      }
    };
    const onLeave = () => {
      tx = -9999;
      ty = -9999;
      px = -9999;
      py = -9999;
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );

    async function start() {
      // Load the Tamil face before building the atlas, or every glyph bakes in
      // as a fallback box that no amount of later re-render will fix.
      try {
        await Promise.race([
          document.fonts.load('500 96px "Noto Serif Tamil"'),
          new Promise((r) => setTimeout(r, 2500)),
        ]);
        await document.fonts.ready;
      } catch {
        /* fall through: worst case we draw with the fallback face */
      }
      if (disposed) return;

      buildAtlas();
      resize();
      ro.observe(host!);
      io.observe(host!);
      document.addEventListener("visibilitychange", onVisibility);
      if (interactive && !reduced) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("pointerleave", onLeave);
      }
      last = performance.now();
      raf = requestAnimationFrame(draw);
    }

    void start();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [mode, density, speed, interactive, opacity, fps]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
