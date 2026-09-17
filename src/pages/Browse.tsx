import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Search } from "lucide-react";
import { allGenres, allPlatforms, platformsFor, withExtended } from "../lib/gamesData";
import { eraForYear } from "../lib/types";
import { useCatalogStore } from "../lib/catalogStore";
import { useCustomGamesStore } from "../lib/customGamesStore";
import GameCard from "../components/GameCard";

type SortKey = "rating" | "year" | "title";
const ERAS = ["80s", "90s", "2000s", "2010s", "2020s"];

export default function Browse() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [era, setEra] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("rating");
  const liveGames = useCatalogStore((s) => s.liveGames);
  const catalogStatus = useCatalogStore((s) => s.status);
  const customGames = useCustomGamesStore((s) => s.customGames);
  const addCustomGame = useCustomGamesStore((s) => s.addCustomGame);

  const allGames = useMemo(() => withExtended(liveGames, customGames), [liveGames, customGames]);

  const filtered = useMemo(() => {
    let list = allGames;
    if (genre !== "all") list = list.filter((g) => g.genres.includes(genre));
    if (platform !== "all") list = list.filter((g) => platformsFor(g).includes(platform));
    if (era !== "all") list = list.filter((g) => eraForYear(g.year) === era);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          (g.developer ?? "").toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "rating":
        sorted.sort((a, b) => b.communityRating - a.communityRating);
        break;
      case "year":
        sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [allGames, query, genre, platform, era, sort]);

  function handleAddAndRate() {
    const game = addCustomGame(query.trim());
    navigate(`/games/${game.slug}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">Catalog</p>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">All games</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-400">
          Browse and log anything from the collection — rate it, review it, or
          add it straight to a list.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, studio, tag…"
            className="w-full rounded-full border border-ink-700 bg-ink-800 py-2 pl-8 pr-3 text-sm text-ink-100 outline-none focus:border-accent-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent-500/50"
          >
            <option value="all">All genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent-500/50"
          >
            <option value="all">All platforms</option>
            {allPlatforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={era}
            onChange={(e) => setEra(e.target.value)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent-500/50"
          >
            <option value="all">All eras</option>
            {ERAS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent-500/50"
          >
            <option value="rating">Top rated</option>
            <option value="year">Newest</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>

      <p className="mb-4 flex items-center gap-2 text-xs text-ink-500">
        {filtered.length} games
        {catalogStatus === "loading" && (
          <span className="inline-flex items-center gap-1 text-ink-400">
            <Loader2 size={11} className="animate-spin" /> pulling in more from the live catalog…
          </span>
        )}
      </p>

      {filtered.length === 0 && query.trim() ? (
        <div className="rounded-2xl border border-dashed border-ink-700 py-16 text-center">
          <p className="text-ink-400">No games matched &ldquo;{query.trim()}&rdquo;.</p>
          <button
            type="button"
            onClick={handleAddAndRate}
            className="pixel-shadow mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 font-display text-base font-bold text-ink-950 transition hover:bg-accent-400"
          >
            <Plus size={16} /> Add &ldquo;{query.trim()}&rdquo; and rate it
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
