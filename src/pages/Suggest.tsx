import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Loader2, Search } from "lucide-react";
import { submitSuggestion } from "../lib/community";
import { searchGamesLive, type GameSearchResult } from "../lib/gameSearchApi";
import { useToastStore } from "../lib/toastStore";

export default function Suggest() {
  const navigate = useNavigate();
  const pushToast = useToastStore((s) => s.push);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [platform, setPlatform] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [reason, setReason] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");

  const [searchResults, setSearchResults] = useState<GameSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const skipNextSearch = useRef(false);

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (title.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      setSearchAttempted(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setSearchAttempted(false);
    const timer = setTimeout(() => {
      searchGamesLive(title).then((results) => {
        if (cancelled) return;
        setSearchResults(results);
        setSearching(false);
        setSearchAttempted(true);
        setDropdownOpen(true);
      });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [title]);

  function handlePickResult(result: GameSearchResult) {
    skipNextSearch.current = true;
    setTitle(result.title);
    if (result.thumb) setCoverUrl(result.thumb);
    setDropdownOpen(false);
    setSearchResults([]);
    setSearchAttempted(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !platform.trim() || !reason.trim()) return;
    setSubmitting(true);
    try {
      await submitSuggestion({
        title: title.trim(),
        releaseYear: releaseYear ? Number(releaseYear) : undefined,
        platform: platform.trim(),
        coverUrl: coverUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        reason: reason.trim(),
        submittedBy: submittedBy.trim() || undefined,
      });
      pushToast("Suggestion submitted — thanks for the pick!");
      navigate("/suggestions");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-accent-500 neon-text">
        Community
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
        Suggest a game
      </h1>
      <p className="mt-2 max-w-lg text-sm text-ink-400">
        Missing a classic, or something obscure you think deserves a spot in
        the catalog? Pitch it below — the community upvotes suggestions on{" "}
        <span className="text-accent-400">/suggestions</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 glass flex flex-col gap-5 rounded-2xl p-5 sm:p-6">
        <Field
          label="Game title"
          required
          hint="Start typing — we'll search Steam's catalog and fill in the cover for you. Can't find it there? Just keep typing and fill the rest in yourself."
        >
          <div className="relative">
            <div className="relative">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => searchResults.length > 0 && setDropdownOpen(true)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                required
                autoComplete="off"
                placeholder="e.g. Panzer Dragoon Saga"
                className="input pr-9"
              />
              {searching ? (
                <Loader2
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-ink-400"
                />
              ) : (
                <Search
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500"
                />
              )}
            </div>
            {dropdownOpen && searchResults.length > 0 && (
              <div className="scrollbar-thin glass-strong absolute z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-lg">
                {searchResults.map((r) => (
                  <button
                    key={`${r.title}-${r.steamAppID}`}
                    type="button"
                    onMouseDown={() => handlePickResult(r)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-700"
                  >
                    {r.thumb ? (
                      <img src={r.thumb} alt="" className="h-8 w-14 shrink-0 rounded object-cover" />
                    ) : (
                      <span className="flex h-8 w-14 shrink-0 items-center justify-center rounded bg-ink-800 text-ink-600">
                        <Gamepad2 size={14} />
                      </span>
                    )}
                    <span className="line-clamp-1">{r.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {searching && (
            <p className="mt-1.5 text-xs text-ink-500">Searching…</p>
          )}
          {!searching && searchAttempted && searchResults.length === 0 && (
            <p className="mt-1.5 text-xs text-ink-500">
              No live matches for &ldquo;{title.trim()}&rdquo; — just type the rest of the details
              in yourself below.
            </p>
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Release year">
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="1998"
              min={1970}
              max={2030}
              className="input"
            />
          </Field>
          <Field label="Platform" required>
            <input
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
              placeholder="e.g. Sega Saturn, Arcade, SNES"
              className="input"
            />
          </Field>
        </div>

        <Field label="Cover image URL" hint="Auto-filled when you pick a search result, or paste your own link.">
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://…"
            className="input"
          />
        </Field>

        {coverUrl.trim() && (
          <img
            src={coverUrl.trim()}
            alt="Cover preview"
            className="h-40 w-28 rounded-lg border border-ink-600 object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        <Field label="Video link" hint="YouTube trailer or gameplay walkthrough URL.">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
            className="input"
          />
        </Field>

        <Field label="Why should we add this game?" required>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={4}
            placeholder="What makes it worth playing — or worth remembering?"
            className="input resize-none"
          />
        </Field>

        <Field label="Your name" hint="Optional — shown next to the suggestion.">
          <input
            value={submittedBy}
            onChange={(e) => setSubmittedBy(e.target.value)}
            placeholder="Anonymous"
            className="input"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="pixel-shadow mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3 font-display text-lg font-bold text-ink-950 transition hover:bg-accent-400 disabled:opacity-60"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Gamepad2 size={18} />}
          {submitting ? "Submitting…" : "Submit suggestion"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label} {required && <span className="text-neon-magenta">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </label>
  );
}
