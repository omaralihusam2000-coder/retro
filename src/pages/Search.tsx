import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { withExtended } from "../lib/gamesData";
import { useCatalogStore } from "../lib/catalogStore";
import GameCard from "../components/GameCard";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const liveGames = useCatalogStore((s) => s.liveGames);
  const allGames = useMemo(() => withExtended(liveGames), [liveGames]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.trim().toLowerCase();
    return allGames.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        (g.developer ?? "").toLowerCase().includes(query) ||
        g.genres.some((genre) => genre.toLowerCase().includes(query)) ||
        g.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [allGames, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">Search</p>
      <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
        {q ? (
          <>
            Results for <span className="text-accent-400">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          "Search Retro"
        )}
      </h1>
      <p className="mt-2 text-sm text-ink-400">{results.length} games found</p>

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {results.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        q && (
          <div className="mt-16 rounded-2xl border border-dashed border-ink-700 py-16 text-center text-ink-400">
            No games matched that search.
          </div>
        )
      )}
    </div>
  );
}
