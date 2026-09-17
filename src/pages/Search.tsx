import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { withExtended } from "../lib/gamesData";
import { useCatalogStore } from "../lib/catalogStore";
import { useCustomGamesStore } from "../lib/customGamesStore";
import GameCard from "../components/GameCard";

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";
  const liveGames = useCatalogStore((s) => s.liveGames);
  const customGames = useCustomGamesStore((s) => s.customGames);
  const addCustomGame = useCustomGamesStore((s) => s.addCustomGame);
  const allGames = useMemo(() => withExtended(liveGames, customGames), [liveGames, customGames]);

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

  function handleAddAndRate() {
    const game = addCustomGame(q.trim());
    navigate(`/games/${game.slug}`);
  }

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
          <div className="mt-16 rounded-2xl border border-dashed border-ink-700 py-16 text-center">
            <p className="text-ink-400">No games matched &ldquo;{q}&rdquo;.</p>
            <button
              type="button"
              onClick={handleAddAndRate}
              className="pixel-shadow mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 font-display text-base font-bold text-ink-950 transition hover:bg-accent-400"
            >
              <Plus size={16} /> Add &ldquo;{q}&rdquo; and rate it
            </button>
          </div>
        )
      )}
    </div>
  );
}
