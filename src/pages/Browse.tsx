import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { allGenres, games } from "../lib/gamesData";
import GameCard from "../components/GameCard";

type SortKey = "rating" | "year" | "title";

export default function Browse() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let list = games;
    if (genre !== "all") list = list.filter((g) => g.genres.includes(genre));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.developer.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "rating":
        sorted.sort((a, b) => b.communityRating - a.communityRating);
        break;
      case "year":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [query, genre, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-500">Catalog</p>
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
            className="w-full rounded-full border border-ink-700 bg-ink-800 py-2 pl-8 pr-3 text-sm text-ink-100 outline-none focus:border-neon-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-neon-500/50"
          >
            <option value="all">All genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-neon-500/50"
          >
            <option value="rating">Top rated</option>
            <option value="year">Newest</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-xs text-ink-500">{filtered.length} games</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
