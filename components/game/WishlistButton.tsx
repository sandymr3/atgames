import { STEAM_PATH } from "@/components/game/PlatformIcons";
import { STEAM_URL } from "@/lib/site";

export default function WishlistButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <a
      href={STEAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-4 border border-chalk/25 bg-black/50 px-6 py-4 backdrop-blur transition-colors duration-500 hover:border-blood-lit hover:bg-blood/25 ${className}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-chalk/85">
        <path d={STEAM_PATH} />
      </svg>
      <span className="text-[0.7rem] uppercase tracking-[0.24em] text-chalk/90">
        Wishlist on Steam
      </span>
    </a>
  );
}
