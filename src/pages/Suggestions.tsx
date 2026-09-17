import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Gamepad2, Plus } from "lucide-react";
import { fetchSuggestions, hasVotedLocally, upvoteSuggestion } from "../lib/community";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import type { Suggestion } from "../lib/types";
import { useToastStore } from "../lib/toastStore";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    let cancelled = false;
    fetchSuggestions().then((data) => {
      if (!cancelled) setSuggestions(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpvote(id: string) {
    if (hasVotedLocally(id)) return;
    setSuggestions((prev) =>
      prev ? prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)) : prev,
    );
    await upvoteSuggestion(id);
    pushToast("Upvoted!");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-accent-500 neon-text">
            Community
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            Suggested games
          </h1>
          <p className="mt-2 max-w-lg text-sm text-ink-400">
            Vote up the games you want added to the catalog next.
            {!isSupabaseConfigured && (
              <span className="mt-1 block text-xs text-ink-500">
                Running in local mode — suggestions and votes stay on this device until a
                Supabase project is wired in.
              </span>
            )}
          </p>
        </div>
        <Link
          to="/suggest"
          className="pixel-shadow inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 font-display text-base font-bold text-ink-950 transition hover:bg-accent-400"
        >
          <Plus size={16} /> Suggest a game
        </Link>
      </div>

      {suggestions === null && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-ink-800" />
          ))}
        </div>
      )}

      {suggestions?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink-700 py-20 text-center">
          <Gamepad2 className="mx-auto mb-3 text-ink-600" size={32} />
          <p className="text-ink-400">No suggestions yet — be the first to pitch one.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {suggestions?.map((s) => {
          const voted = hasVotedLocally(s.id);
          return (
            <div key={s.id} className="glass flex gap-4 rounded-2xl p-4 sm:p-5">
              <div className="poster h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-ink-600 bg-ink-800 sm:h-28 sm:w-20">
                {s.coverUrl ? (
                  <img src={s.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-600">
                    <Gamepad2 size={22} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-white">{s.title}</h2>
                  {s.releaseYear && (
                    <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[11px] text-ink-300">
                      {s.releaseYear}
                    </span>
                  )}
                  <span className="rounded-full bg-neon-green-500/10 px-2 py-0.5 text-[11px] font-semibold text-neon-green-500">
                    {s.platform}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{s.reason}</p>
                <p className="mt-2 text-xs text-ink-500">
                  Suggested by {s.submittedBy || "Anonymous"}
                  {s.videoUrl && (
                    <>
                      {" · "}
                      <a
                        href={s.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-400 hover:underline"
                      >
                        Watch video
                      </a>
                    </>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleUpvote(s.id)}
                disabled={voted}
                className={`flex h-fit shrink-0 flex-col items-center gap-0.5 rounded-lg border px-3 py-2 font-display text-lg font-bold transition ${
                  voted
                    ? "border-accent-500/50 bg-accent-500/10 text-accent-400"
                    : "border-ink-600 text-ink-300 hover:border-accent-500/50 hover:text-accent-400"
                }`}
                title={voted ? "You already upvoted this" : "Upvote"}
              >
                <ArrowUp size={16} />
                {s.votes}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
