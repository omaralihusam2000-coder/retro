import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useUserStore } from "../lib/store";
import { useToastStore } from "../lib/toastStore";
import { getGameById } from "../lib/gamesData";
import PosterImage from "../components/PosterImage";

export default function Lists() {
  const lists = useUserStore((s) => s.lists);
  const createList = useUserStore((s) => s.createList);
  const pushToast = useToastStore((s) => s.push);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  function handleCreate() {
    if (!name.trim()) return;
    createList(name.trim(), description.trim());
    pushToast(`Created "${name.trim()}"`);
    setName("");
    setDescription("");
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-500">Curated</p>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Your lists</h1>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-neon-500 px-4 py-2 text-sm font-bold text-ink-950 transition hover:bg-neon-400"
        >
          <Plus size={16} /> New list
        </button>
      </div>

      {open && (
        <div className="mb-8 rounded-xl border border-ink-700 bg-ink-800 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="List name"
              className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 outline-none focus:border-neon-500/50"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 outline-none focus:border-neon-500/50"
            />
          </div>
          <button
            onClick={handleCreate}
            className="mt-3 rounded-full bg-neon-500 px-4 py-1.5 text-sm font-bold text-ink-950 hover:bg-neon-400"
          >
            Create
          </button>
        </div>
      )}

      {lists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-700 py-20 text-center">
          <p className="text-ink-400">
            No lists yet. Start one for your comfort games, your backlog shame
            pile, or the games you're saving for a rainy weekend.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={`/lists/${list.id}`}
              className="card-glow-hover overflow-hidden rounded-xl border border-ink-700 bg-ink-800"
            >
              <div className="grid h-28 grid-cols-4">
                {list.gameIds.slice(0, 4).map((id) => {
                  const game = getGameById(id);
                  if (!game) return null;
                  return (
                    <div key={id} className="overflow-hidden">
                      <PosterImage src={game.cover} title={game.title} />
                    </div>
                  );
                })}
                {Array.from({ length: Math.max(0, 4 - list.gameIds.length) }).map((_, i) => (
                  <div key={i} className="bg-ink-900" />
                ))}
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-ink-100">{list.name}</p>
                {list.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-ink-400">{list.description}</p>
                )}
                <p className="mt-1.5 text-xs text-ink-500">{list.gameIds.length} games</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
