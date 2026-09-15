import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { allGenres, games } from "../lib/gamesData";
import GameCard from "../components/GameCard";

export default function Genre() {
  const { genre } = useParams();
  const matched = allGenres.find((g) => g.toLowerCase() === genre?.toLowerCase());
  const list = matched ? games.filter((g) => g.genres.includes(matched)) : [];

  if (!matched) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Genre not found</h1>
        <Link to="/games" className="mt-4 inline-block text-neon-400 hover:underline">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/games"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-400 hover:text-neon-400"
      >
        <ArrowLeft size={14} /> All games
      </Link>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-500">Genre</p>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{matched}</h1>
      <p className="mt-2 text-sm text-ink-400">{list.length} games</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {allGenres.map((g) => (
          <Link
            key={g}
            to={`/genres/${encodeURIComponent(g)}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              g === matched
                ? "bg-neon-500 text-ink-950"
                : "bg-ink-800 text-ink-300 hover:bg-ink-700"
            }`}
          >
            {g}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {list.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
