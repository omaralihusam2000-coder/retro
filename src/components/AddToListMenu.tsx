import { useState } from "react";
import { Check, ListPlus, Plus } from "lucide-react";
import { useUserStore } from "../lib/store";

export default function AddToListMenu({ gameId }: { gameId: string }) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const lists = useUserStore((s) => s.lists);
  const addToList = useUserStore((s) => s.addToList);
  const removeFromList = useUserStore((s) => s.removeFromList);
  const createList = useUserStore((s) => s.createList);

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = createList(trimmed, "");
    addToList(id, gameId);
    setName("");
    setCreating(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-4 py-2 text-sm font-semibold text-ink-200 transition hover:border-neon-500/50 hover:text-neon-400"
      >
        <ListPlus size={15} /> Add to list
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-ink-700 bg-ink-800 p-2 shadow-xl">
            <div className="max-h-52 overflow-y-auto">
              {lists.length === 0 && !creating && (
                <p className="px-2 py-3 text-center text-xs text-ink-400">No lists yet.</p>
              )}
              {lists.map((list) => {
                const included = list.gameIds.includes(gameId);
                return (
                  <button
                    key={list.id}
                    onClick={() =>
                      included ? removeFromList(list.id, gameId) : addToList(list.id, gameId)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-ink-200 hover:bg-ink-700"
                  >
                    <span className="truncate">{list.name}</span>
                    {included && <Check size={15} className="text-neon-400" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-1 border-t border-ink-700 pt-2">
              {creating ? (
                <div className="flex gap-1.5 px-1">
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="New list name"
                    className="w-full rounded-lg border border-ink-600 bg-ink-900 px-2 py-1.5 text-sm text-ink-100 outline-none focus:border-neon-500/50"
                  />
                  <button
                    onClick={handleCreate}
                    className="shrink-0 rounded-lg bg-neon-500 px-2.5 text-sm font-bold text-ink-950"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreating(true)}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-neon-400 hover:bg-ink-700"
                >
                  <Plus size={15} /> New list
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
