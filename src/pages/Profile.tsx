import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  X,
} from "lucide-react";
import { useUserStore } from "../lib/store";
import { computeStats } from "../lib/stats";
import { getGameById, withExtended } from "../lib/gamesData";
import { useCatalogStore } from "../lib/catalogStore";
import { useCustomGamesStore } from "../lib/customGamesStore";
import { formatDate } from "../lib/format";
import Avatar from "../components/Avatar";
import GameCard from "../components/GameCard";
import PosterImage from "../components/PosterImage";
import StarRating from "../components/StarRating";
import StatusPicker from "../components/StatusPicker";
import RecommendBadge from "../components/RecommendBadge";

type Tab = "overview" | "ratings" | "reviews" | "lists";

export default function Profile() {
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [addingFavorite, setAddingFavorite] = useState(false);
  const [favoriteQuery, setFavoriteQuery] = useState("");

  const displayName = useUserStore((s) => s.displayName);
  const handle = useUserStore((s) => s.handle);
  const bio = useUserStore((s) => s.bio);
  const joinedAt = useUserStore((s) => s.joinedAt);
  const logs = useUserStore((s) => s.logs);
  const lists = useUserStore((s) => s.lists);
  const favorites = useUserStore((s) => s.favorites);
  const setStatus = useUserStore((s) => s.setStatus);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const setHandle = useUserStore((s) => s.setHandle);
  const setBio = useUserStore((s) => s.setBio);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);

  const liveGames = useCatalogStore((s) => s.liveGames);
  const customGames = useCustomGamesStore((s) => s.customGames);
  const allGames = useMemo(() => withExtended(liveGames, customGames), [liveGames, customGames]);

  const [nameDraft, setNameDraft] = useState(displayName);
  const [handleDraft, setHandleDraft] = useState(handle);
  const [bioDraft, setBioDraft] = useState(bio);

  const stats = useMemo(() => computeStats(logs), [logs]);
  const level = 1 + Math.floor(stats.totalLogged / 5);

  const diaryEntries = useMemo(
    () =>
      Object.values(logs)
        .filter((e) => e.rating || e.review || e.status)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [logs],
  );

  const ratedGames = useMemo(
    () =>
      diaryEntries
        .filter((e) => typeof e.rating === "number")
        .map((e) => getGameById(e.gameId))
        .filter((g): g is NonNullable<typeof g> => !!g),
    [diaryEntries],
  );

  const favoriteGames = favorites
    .map((id) => allGames.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => !!g);

  const favoriteCandidates = allGames.filter(
    (g) =>
      !favorites.includes(g.id) &&
      g.title.toLowerCase().includes(favoriteQuery.trim().toLowerCase()),
  );

  const reviewedEntries = diaryEntries.filter((e) => e.review && e.review.trim().length > 0);

  function startEditing() {
    setNameDraft(displayName);
    setHandleDraft(handle);
    setBioDraft(bio);
    setEditing(true);
  }

  function saveEditing() {
    setDisplayName(nameDraft.trim() || "You");
    setHandle(handleDraft.trim().replace(/\s+/g, "").toLowerCase() || "you");
    setBio(bioDraft.trim());
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div
        className="relative -mx-4 h-36 overflow-hidden sm:-mx-6 sm:h-44"
        style={{
          background:
            "linear-gradient(120deg, rgba(0,245,255,0.25), rgba(255,43,214,0.2) 60%, rgba(0,0,0,0))",
        }}
      >
        <div className="crt-scanlines opacity-40" style={{ position: "absolute" }} aria-hidden="true" />
        <button
          type="button"
          onClick={editing ? saveEditing : startEditing}
          className="glass absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white sm:right-6"
        >
          <Pencil size={13} /> {editing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="-mt-12 flex flex-col items-start gap-4 px-1 sm:-mt-14 sm:flex-row sm:items-end">
        <div className="relative shrink-0">
          <div className="rounded-full border-4 border-ink-950 bg-ink-950">
            <Avatar seed={handle} size={88} />
          </div>
          <span className="font-pixel absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-500 px-2 py-0.5 text-[9px] text-ink-950 shadow-glow-accent">
            Lv. {level}
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-2">
          {editing ? (
            <div className="flex flex-col gap-2 sm:max-w-sm">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Display name"
                className="input"
              />
              <input
                value={handleDraft}
                onChange={(e) => setHandleDraft(e.target.value)}
                placeholder="handle"
                className="input"
              />
              <textarea
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                placeholder="Short bio"
                rows={2}
                className="input resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEditing}
                  className="rounded-full bg-accent-500 px-4 py-1.5 text-sm font-bold text-ink-950"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-ink-600 px-4 py-1.5 text-sm font-semibold text-ink-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{displayName}</h1>
              <p className="text-sm text-ink-400">@{handle}</p>
              {bio && <p className="mt-1.5 max-w-lg text-sm text-ink-300">{bio}</p>}
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Calendar size={12} /> Joined {formatDate(joinedAt)}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={MessageSquare} label="Reviews" value={stats.reviewsWritten} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} />
        <StatCard icon={Star} label="Rated" value={ratedGames.length} />
        <StatCard
          icon={Heart}
          label="Favorite genre"
          value={stats.favoriteGenre ?? "—"}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 glass rounded-2xl px-5 py-4 text-sm text-ink-300">
        <span className="inline-flex items-center gap-1.5">
          <Star size={15} className="fill-amber-400 text-amber-400" />
          <strong className="text-ink-100">
            {stats.averageRating !== null ? stats.averageRating.toFixed(1) : "—"}
          </strong>{" "}
          average rating
        </span>
        <span>
          <strong className="text-ink-100">{stats.playing}</strong> playing
        </span>
        <span>
          <strong className="text-ink-100">{stats.backlog}</strong> backlog
        </span>
        <span>
          <strong className="text-ink-100">{stats.wishlist}</strong> wishlist
        </span>
      </div>

      <div className="mt-8 inline-flex rounded-full border border-ink-700 bg-ink-800 p-1">
        {(
          [
            ["overview", "Overview"],
            ["ratings", "Ratings"],
            ["reviews", "Reviews"],
            ["lists", "Lists"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
              tab === key ? "bg-accent-500 text-ink-950" : "text-ink-300 hover:text-ink-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "overview" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Favorites</h2>
              <button
                type="button"
                onClick={() => setAddingFavorite((v) => !v)}
                className="text-sm font-semibold text-accent-400 hover:underline"
              >
                {addingFavorite ? "Done" : "Add game"}
              </button>
            </div>

            {addingFavorite && (
              <div className="mb-5 glass rounded-2xl p-4">
                <input
                  value={favoriteQuery}
                  onChange={(e) => setFavoriteQuery(e.target.value)}
                  placeholder="Search games to favorite…"
                  className="input mb-3"
                />
                <div className="scrollbar-thin flex max-h-56 flex-col gap-1 overflow-y-auto">
                  {favoriteCandidates.slice(0, 20).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => toggleFavorite(g.id)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-700"
                    >
                      <span>
                        {g.title}
                        {g.year && <span className="text-ink-500"> ({g.year})</span>}
                      </span>
                      <Plus size={15} className="text-accent-400" />
                    </button>
                  ))}
                  {favoriteCandidates.length === 0 && (
                    <p className="px-3 py-4 text-sm text-ink-400">No matches.</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              <button
                type="button"
                onClick={() => setAddingFavorite(true)}
                className="poster flex items-center justify-center rounded-2xl border-2 border-dashed border-ink-700 text-ink-600 transition hover:border-accent-500/50 hover:text-accent-400"
              >
                <Plus size={22} />
              </button>
              {favoriteGames.map((game) => (
                <div key={game.id} className="group relative">
                  <GameCard game={game} />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(game.id)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-ink-950/80 p-1 text-ink-200 opacity-0 transition hover:text-neon-magenta group-hover:opacity-100"
                    aria-label="Remove from favorites"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <h2 className="mb-4 mt-10 font-display text-lg font-bold text-white">Recent activity</h2>
            {diaryEntries.length === 0 ? (
              <EmptyState text="Nothing logged yet — head to the catalog and rate something." />
            ) : (
              <div className="flex flex-col divide-y divide-ink-800">
                {diaryEntries.slice(0, 8).map((entry) => {
                  const game = getGameById(entry.gameId);
                  if (!game) return null;
                  return (
                    <div key={entry.gameId} className="flex gap-4 py-4">
                      <Link to={`/games/${game.slug}`} className="poster w-16 shrink-0 overflow-hidden rounded-xl">
                        <PosterImage src={game.cover} title={game.title} />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/games/${game.slug}`}
                            className="font-display font-semibold text-ink-100 hover:text-accent-400"
                          >
                            {game.title}
                          </Link>
                          <span className="text-xs text-ink-500">{formatDate(entry.updatedAt)}</span>
                        </div>
                        {(entry.rating || entry.recommend !== undefined) && (
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {entry.rating ? <StarRating value={entry.rating} readOnly size={14} /> : null}
                            <RecommendBadge recommend={entry.recommend} />
                          </div>
                        )}
                        {entry.review && (
                          <p className="mt-1.5 line-clamp-2 text-sm text-ink-300">{entry.review}</p>
                        )}
                        <div className="mt-2">
                          <StatusPicker value={entry.status} onChange={(s) => setStatus(entry.gameId, s)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "ratings" &&
          (ratedGames.length === 0 ? (
            <EmptyState text="Rate a few games to build your grid." />
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {ratedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ))}

        {tab === "reviews" &&
          (reviewedEntries.length === 0 ? (
            <EmptyState text="No written reviews yet." />
          ) : (
            <div className="flex flex-col divide-y divide-ink-800">
              {reviewedEntries.map((entry) => {
                const game = getGameById(entry.gameId);
                if (!game) return null;
                return (
                  <div key={entry.gameId} className="py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/games/${game.slug}`}
                        className="font-display font-semibold text-ink-100 hover:text-accent-400"
                      >
                        {game.title}
                      </Link>
                      {entry.rating ? <StarRating value={entry.rating} readOnly size={13} /> : null}
                      <RecommendBadge recommend={entry.recommend} />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{entry.review}</p>
                  </div>
                );
              })}
            </div>
          ))}

        {tab === "lists" &&
          (lists.length === 0 ? (
            <EmptyState text="You haven't built a list yet." cta="/lists" ctaLabel="Create a list" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {lists.map((list) => (
                <Link
                  key={list.id}
                  to={`/lists/${list.id}`}
                  className="card-glow-hover glass rounded-2xl p-4"
                >
                  <p className="font-display font-semibold text-ink-100">{list.name}</p>
                  <p className="mt-1 text-sm text-ink-400">{list.gameIds.length} games</p>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: number | string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon size={18} className="mb-2 text-accent-400" />
      <p className="line-clamp-1 font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}

function EmptyState({ text, cta, ctaLabel }: { text: string; cta?: string; ctaLabel?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-700 py-16 text-center">
      <p className="text-sm text-ink-400">{text}</p>
      {cta && (
        <Link to={cta} className="mt-3 inline-block text-sm font-semibold text-accent-400 hover:underline">
          {ctaLabel ?? "Browse games"}
        </Link>
      )}
    </div>
  );
}
