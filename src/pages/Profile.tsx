import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkPlus, CheckCircle2, Heart, PlayCircle, Star } from "lucide-react";
import { useUserStore } from "../lib/store";
import { computeStats } from "../lib/stats";
import { getGameById } from "../lib/gamesData";
import { formatDate } from "../lib/format";
import Avatar from "../components/Avatar";
import GameCard from "../components/GameCard";
import PosterImage from "../components/PosterImage";
import StarRating from "../components/StarRating";
import StatusPicker from "../components/StatusPicker";
import RecommendBadge from "../components/RecommendBadge";

type Tab = "diary" | "ratings" | "reviews" | "lists";

export default function Profile() {
  const [tab, setTab] = useState<Tab>("diary");
  const displayName = useUserStore((s) => s.displayName);
  const handle = useUserStore((s) => s.handle);
  const joinedAt = useUserStore((s) => s.joinedAt);
  const logs = useUserStore((s) => s.logs);
  const lists = useUserStore((s) => s.lists);
  const setStatus = useUserStore((s) => s.setStatus);

  const stats = useMemo(() => computeStats(logs), [logs]);

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

  const reviewedEntries = diaryEntries.filter((e) => e.review && e.review.trim().length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar seed={handle} size={72} />
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{displayName}</h1>
          <p className="text-sm text-ink-400">
            @{handle} &middot; tracking games since {formatDate(joinedAt)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} />
        <StatCard icon={PlayCircle} label="Playing" value={stats.playing} />
        <StatCard icon={BookmarkPlus} label="Backlog" value={stats.backlog} />
        <StatCard icon={Heart} label="Wishlist" value={stats.wishlist} />
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
          <strong className="text-ink-100">{stats.totalLogged}</strong> games logged
        </span>
        <span>
          <strong className="text-ink-100">{stats.reviewsWritten}</strong> reviews written
        </span>
        {stats.favoriteGenre && (
          <span>
            Favorite genre: <strong className="text-ink-100">{stats.favoriteGenre}</strong>
          </span>
        )}
      </div>

      <div className="mt-8 flex gap-1 border-b border-ink-800">
        {(
          [
            ["diary", "Diary"],
            ["ratings", "Ratings"],
            ["reviews", "Reviews"],
            ["lists", "Lists"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`border-b-2 px-4 py-3 font-display text-sm font-semibold transition ${
              tab === key
                ? "border-accent-500 text-accent-400"
                : "border-transparent text-ink-400 hover:text-ink-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "diary" &&
          (diaryEntries.length === 0 ? (
            <EmptyState text="Nothing logged yet — head to the catalog and rate something." />
          ) : (
            <div className="flex flex-col divide-y divide-ink-800">
              {diaryEntries.map((entry) => {
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
          ))}

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
  value: number;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon size={18} className="mb-2 text-accent-400" />
      <p className="font-display text-2xl font-bold text-white">{value}</p>
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
