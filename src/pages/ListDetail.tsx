import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { useUserStore } from "../lib/store";
import { useToastStore } from "../lib/toastStore";
import { games } from "../lib/gamesData";
import GameCard from "../components/GameCard";

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const list = useUserStore((s) => s.lists.find((l) => l.id === id));
  const deleteList = useUserStore((s) => s.deleteList);
  const addToList = useUserStore((s) => s.addToList);
  const removeFromList = useUserStore((s) => s.removeFromList);
  const pushToast = useToastStore((s) => s.push);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");

  if (!list) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-white">List not found</h1>
        <Link to="/lists" className="mt-4 inline-block text-accent-400 hover:underline">
          Back to your lists
        </Link>
      </div>
    );
  }

  const listGames = list.gameIds
    .map((gameId) => games.find((g) => g.id === gameId))
    .filter((g): g is (typeof games)[number] => !!g);
  const candidates = games.filter(
    (g) => !list.gameIds.includes(g.id) && g.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">List</p>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{list.name}</h1>
          {list.description && <p className="mt-2 max-w-xl text-ink-400">{list.description}</p>}
          <p className="mt-1 text-sm text-ink-500">{list.gameIds.length} games</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAdding((v) => !v)}
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-accent-400"
          >
            {adding ? "Done" : "Add games"}
          </button>
          <button
            onClick={() => {
              deleteList(list.id);
              pushToast(`Deleted "${list.name}"`);
              navigate("/lists");
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-4 py-2 text-sm font-semibold text-ink-300 hover:border-red-500/50 hover:text-red-400"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {adding && (
        <div className="mb-8 glass rounded-2xl p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games to add…"
            className="mb-3 w-full rounded-xl border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent-500/50"
          />
          <div className="scrollbar-thin flex max-h-64 flex-col gap-1 overflow-y-auto">
            {candidates.slice(0, 30).map((g) => (
              <button
                key={g.id}
                onClick={() => addToList(list.id, g.id)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-700"
              >
                <span>
                  {g.title} <span className="text-ink-500">({g.year})</span>
                </span>
                <span className="text-accent-400">+ Add</span>
              </button>
            ))}
            {candidates.length === 0 && (
              <p className="px-3 py-4 text-sm text-ink-400">No matches.</p>
            )}
          </div>
        </div>
      )}

      {listGames.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-700 py-20 text-center">
          <p className="text-ink-400">This list is empty — add some games above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {listGames.map((game) => (
            <div key={game.id} className="group relative">
              <GameCard game={game} />
              {adding && (
                <button
                  onClick={() => removeFromList(list.id, game.id)}
                  className="absolute left-1.5 top-1.5 rounded-full bg-ink-950/80 p-1 text-ink-200 hover:text-red-400"
                  aria-label="Remove from list"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
