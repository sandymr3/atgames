import Image from "next/image";
import { MARK, MARK_VIEWBOX } from "@/lib/lockup";

/**
 * A slot for a contributor's photo. Most entries in lib/site.ts have none yet
 * — `photo` stays null until someone supplies one — so the empty state has to
 * look intentional rather than like a broken image. It falls back to the
 * studio mark, faint, in the same ring the photo would sit in.
 */
export default function ContributorAvatar({
  photo,
  label,
}: {
  photo?: string | null;
  label: string;
}) {
  return (
    <div
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-ink-800 transition-colors duration-500 group-hover:border-ember/45 sm:h-16 sm:w-16"
      aria-hidden={!photo}
    >
      {photo ? (
        <Image
          src={photo}
          alt={label}
          fill
          sizes="64px"
          className="object-cover grayscale-[0.2] transition-[filter] duration-500 group-hover:grayscale-0"
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <svg viewBox={MARK_VIEWBOX} className="h-6 w-6 text-ash-500 transition-colors duration-500 group-hover:text-ember/70">
            <path d={MARK.d} transform={MARK.transform} fill="currentColor" opacity={0.55} />
          </svg>
        </div>
      )}
    </div>
  );
}
