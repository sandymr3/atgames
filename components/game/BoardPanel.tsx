import type { ReactNode } from "react";

/**
 * A blackboard: slate wash, chalk-dusted double frame, and the class header
 * lifted straight off the poster. Used as the container for anything that
 * would plausibly be written up at the front of the room.
 */
export default function BoardPanel({
  header = "வகுப்பு: ௭-அ",
  children,
  className = "",
}: {
  header?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative border border-chalk/12 bg-[#0e0c0b] p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] ${className}`}
    >
      <div
        className="relative border border-chalk/8"
        style={{
          backgroundImage:
            "radial-gradient(120% 100% at 30% 0%, rgba(232,227,216,0.045) 0%, transparent 55%), linear-gradient(180deg, #14110f 0%, #0c0a09 100%)",
        }}
      >
        <div className="border-b border-chalk/8 px-6 py-3 text-center sm:px-10">
          <span className="tamil text-[0.82rem] tracking-[0.18em] text-chalk/55">
            {header}
          </span>
        </div>
        <div className="px-6 py-10 sm:px-10 sm:py-14">{children}</div>
      </div>
    </div>
  );
}
