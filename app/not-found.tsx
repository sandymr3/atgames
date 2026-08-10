import Link from "next/link";
import TamilParticleBackground from "@/components/TamilParticleBackground";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden">
      <TamilParticleBackground density={0.6} opacity={0.6} />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <p className="eyebrow">404</p>
        <h1 className="display mt-8 text-[clamp(2rem,6vw,4.4rem)] uppercase">
          Nothing here
        </h1>
        <p className="tamil mt-6 text-xl text-ember-gold">இங்கே ஒன்றுமில்லை.</p>
        <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-ash-400">
          The page you asked for is not on the register.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-4 border border-ember/40 px-7 py-4 transition-colors duration-500 hover:border-ember"
        >
          <span className="text-[0.72rem] uppercase tracking-[0.24em] text-bone">
            Back to the studio
          </span>
          <span className="text-ember transition-transform duration-500 group-hover:-translate-x-1.5">
            ←
          </span>
        </Link>
      </div>
    </section>
  );
}
