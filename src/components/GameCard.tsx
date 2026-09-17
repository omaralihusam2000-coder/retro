import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Game } from "../lib/types";
import { platformsFor } from "../lib/gamesData";
import PosterImage from "./PosterImage";
import { useUserStore } from "../lib/store";

export default function GameCard({ game }: { game: Game }) {
  const userRating = useUserStore((s) => s.logs[game.id]?.rating);
  const platform = platformsFor(game)[0];

  return (
    <Link
      to={`/games/${game.slug}`}
      className="card-glow-hover group relative block overflow-hidden rounded-2xl border border-ink-700 bg-ink-800"
    >
      <div className="poster relative overflow-hidden">
        <PosterImage
          src={game.cover}
          title={game.title}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/0 to-ink-950/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {userRating ? (
          <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-ink-950/80 px-1.5 py-0.5 text-[11px] font-semibold text-amber-400 ring-1 ring-amber-400/30 backdrop-blur">
            <Star size={11} className="fill-amber-400" />
            {userRating.toFixed(1)}
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-2.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-display text-sm font-semibold text-white line-clamp-2">
            {game.title}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-ink-300">
            {game.year}
            {game.year && " · "}
            <span className="text-neon-green-500">{platform}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
