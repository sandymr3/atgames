const ROW =
  "அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ ஃ க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன";

/**
 * A slow band of the alphabet, doubled so the loop is seamless. Pure CSS: it
 * runs on the compositor and costs nothing while the canvas field is busy.
 */
export default function LetterMarquee() {
  return (
    <div className="mask-fade-x relative overflow-hidden border-y border-white/5 py-6">
      <div className="flex w-max animate-[marquee_58s_linear_infinite] gap-10 will-change-transform">
        {[0, 1].map((n) => (
          <span
            key={n}
            aria-hidden={n === 1}
            className="tamil shrink-0 text-[clamp(1.6rem,3.4vw,2.6rem)] tracking-[0.2em] text-ash-500/45 select-none"
          >
            {ROW}
          </span>
        ))}
      </div>
    </div>
  );
}
