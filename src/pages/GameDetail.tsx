import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, Gamepad2, Heart, MessageSquare, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { findGameBySlugExtended, platformsFor } from "../lib/gamesData";
import { useCatalogStore } from "../lib/catalogStore";
import { useCustomGamesStore } from "../lib/customGamesStore";
import { getDeals } from "../lib/dealsApi";
import type { GameComment, LiveDeal, LogStatus, StoreKey } from "../lib/types";
import { formatCompactNumber, formatPrice } from "../lib/format";
import { useUserStore } from "../lib/store";
import { useToastStore } from "../lib/toastStore";
import { reviewsForGame } from "../data/reviewsMock";
import {
  addComment,
  fetchComments,
  fetchPlayedCount,
  hasPlayedLocally,
  markPlayed,
  unmarkPlayed,
} from "../lib/community";
import { toYouTubeEmbedUrl } from "../lib/youtube";
import PosterImage from "../components/PosterImage";
import StarRating from "../components/StarRating";
import StoreBadge from "../components/StoreBadge";
import StatusPicker from "../components/StatusPicker";
import AddToListMenu from "../components/AddToListMenu";
import Avatar from "../components/Avatar";
import RecommendBadge from "../components/RecommendBadge";
import { timeAgo } from "../lib/format";

const STORE_ORDER: StoreKey[] = ["steam", "epic", "gog"];

const STATUS_LABEL: Record<LogStatus, string> = {
  backlog: "Backlog",
  playing: "Playing",
  completed: "Completed",
  wishlist: "Wishlist",
  abandoned: "Abandoned",
};

export default function GameDetail() {
  const { slug } = useParams();
  const liveCatalogGames = useCatalogStore((s) => s.liveGames);
  const customGames = useCustomGamesStore((s) => s.customGames);
  const game = slug ? findGameBySlugExtended(slug, liveCatalogGames, customGames) : undefined;
  const [liveDeals, setLiveDeals] = useState<LiveDeal[]>([]);

  const entry = useUserStore((s) => (game ? s.logs[game.id] : undefined));
  const setRating = useUserStore((s) => s.setRating);
  const setStatus = useUserStore((s) => s.setStatus);
  const setReview = useUserStore((s) => s.setReview);
  const setRecommend = useUserStore((s) => s.setRecommend);
  const addRecentlyViewed = useUserStore((s) => s.addRecentlyViewed);
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const isFavorite = game ? favorites.includes(game.id) : false;
  const [reviewDraft, setReviewDraft] = useState(entry?.review ?? "");
  const pushToast = useToastStore((s) => s.push);

  const [played, setPlayed] = useState(false);
  const [playedCount, setPlayedCount] = useState<number | null>(null);
  const [comments, setComments] = useState<GameComment[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentName, setCommentName] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (game) addRecentlyViewed(game.id);
  }, [game, addRecentlyViewed]);

  useEffect(() => {
    if (!game) return;
    setPlayed(hasPlayedLocally(game.id));
    let cancelled = false;
    fetchPlayedCount(game.id).then((count) => {
      if (!cancelled) setPlayedCount(count);
    });
    fetchComments(game.id).then((data) => {
      if (!cancelled) setComments(data);
    });
    return () => {
      cancelled = true;
    };
  }, [game]);

  async function handleTogglePlayed() {
    if (!game) return;
    const next = !played;
    setPlayed(next);
    setPlayedCount((c) => (c === null ? c : c + (next ? 1 : -1)));
    if (next) {
      await markPlayed(game.id);
      pushToast("Marked as played!");
    } else {
      await unmarkPlayed(game.id);
    }
  }

  async function handlePostComment(e: FormEvent) {
    e.preventDefault();
    if (!game || !commentDraft.trim()) return;
    setPostingComment(true);
    try {
      const comment = await addComment(game.id, commentDraft.trim(), commentName);
      setComments((prev) => [comment, ...prev]);
      setCommentDraft("");
      pushToast("Comment posted");
    } finally {
      setPostingComment(false);
    }
  }

  useEffect(() => {
    setReviewDraft(entry?.review ?? "");
  }, [entry?.review, game?.id]);

  useEffect(() => {
    if (!game) return;
    let cancelled = false;
    getDeals(120).then((res) => {
      if (cancelled) return;
      const matches = res.deals.filter(
        (d) => d.gameTitle.toLowerCase() === game.title.toLowerCase(),
      );
      setLiveDeals(matches);
    });
    return () => {
      cancelled = true;
    };
  }, [game]);

  if (!game) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Game not found</h1>
        <Link to="/games" className="mt-4 inline-block text-accent-400 hover:underline">
          Back to browse
        </Link>
      </div>
    );
  }

  function bestDealFor(storeKey: StoreKey): LiveDeal | undefined {
    return liveDeals.find((d) => d.storeKey === storeKey);
  }

  const reviews = reviewsForGame(game.id);

  function handleSaveReview() {
    setReview(game!.id, reviewDraft);
    pushToast("Review saved");
  }

  return (
    <div>
      <div className="backdrop-16-9 relative max-h-[420px] w-full overflow-hidden border-b border-ink-800">
        <PosterImage src={game.backdrop} title={game.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-24 flex flex-col gap-6 sm:-mt-32 sm:flex-row sm:gap-8">
          <div className="poster w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-ink-700 shadow-2xl sm:w-52">
            <PosterImage src={game.cover} title={game.title} />
          </div>
          <div className="flex-1 pb-4 pt-2 sm:pt-20">
            <h1 className="font-display text-2xl font-bold text-white sm:text-4xl">{game.title}</h1>
            {(game.year || game.developer) && (
              <p className="mt-1 text-sm text-ink-300 sm:text-base">
                {game.year}
                {game.year && game.developer && <> &middot; </>}
                {game.developer}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {platformsFor(game).map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-neon-green-500/10 px-2.5 py-1 text-xs font-semibold text-neon-green-500"
                >
                  {p}
                </span>
              ))}
              {game.genres.map((g) => (
                <Link
                  key={g}
                  to={`/genres/${encodeURIComponent(g)}`}
                  className="rounded-full bg-ink-800 px-2.5 py-1 text-xs font-medium text-ink-300 transition hover:bg-ink-700 hover:text-accent-400"
                >
                  {g}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-300">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              {game.ratingCount > 0 ? (
                <>
                  <span className="font-semibold text-ink-100">{game.communityRating.toFixed(1)}</span>
                  <span>average &middot; {formatCompactNumber(game.ratingCount)} ratings</span>
                </>
              ) : (
                <span>No community ratings yet — be the first</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleTogglePlayed}
              className={`pixel-shadow mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-display text-base font-bold transition ${
                played
                  ? "border-neon-green-500 bg-neon-green-500/15 text-neon-green-500"
                  : "border-ink-600 text-ink-300 hover:border-neon-green-500/50 hover:text-neon-green-500"
              }`}
            >
              <Gamepad2 size={16} /> {played ? "Played it!" : "Mark as played"}
              {playedCount !== null && (
                <span className="text-xs font-normal text-ink-400">
                  · {formatCompactNumber(playedCount)} played
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-[1fr_360px]">
          <div>
            {game.legacy && (
              <div className="mb-5 rounded-2xl border border-neon-green-500/20 bg-neon-green-500/5 p-4">
                <p className="font-pixel mb-2 text-[10px] uppercase tracking-[0.2em] text-neon-green-500">
                  Legacy &amp; impact
                </p>
                <p className="text-sm leading-relaxed text-ink-200">{game.legacy}</p>
              </div>
            )}

            <p className="max-w-2xl text-base leading-relaxed text-ink-200">{game.description}</p>

            {game.trailerUrl && toYouTubeEmbedUrl(game.trailerUrl) && (
              <div className="mt-8">
                <h2 className="mb-3 font-display text-lg font-bold text-white">Trailer</h2>
                <div className="backdrop-16-9 overflow-hidden rounded-2xl border border-ink-700">
                  <iframe
                    src={toYouTubeEmbedUrl(game.trailerUrl)!}
                    title={`${game.title} trailer`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 font-display text-lg font-bold text-white">Screenshots</h2>
                <div className="scrollbar-thin -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                  {game.screenshots.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${game.title} screenshot ${i + 1}`}
                      className="h-32 w-56 shrink-0 rounded-lg border border-ink-700 object-cover sm:h-40 sm:w-72"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 glass rounded-2xl p-5">
              <h2 className="mb-4 font-display text-lg font-bold text-white">Your activity</h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Your rating
                  </p>
                  <StarRating
                    value={entry?.rating ?? 0}
                    onChange={(v) => {
                      setRating(game.id, v || undefined);
                      pushToast(v ? `Rated ${v.toFixed(1)} stars` : "Rating cleared");
                    }}
                    size={24}
                    showValue
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toggleFavorite(game.id);
                      pushToast(isFavorite ? "Removed from favorites" : "Added to favorites");
                    }}
                    aria-pressed={isFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                      isFavorite
                        ? "border-neon-magenta bg-neon-magenta/15 text-neon-magenta"
                        : "border-ink-600 text-ink-300 hover:border-neon-magenta/50 hover:text-neon-magenta"
                    }`}
                  >
                    <Heart size={16} className={isFavorite ? "fill-current" : ""} />
                  </button>
                  <AddToListMenu gameId={game.id} />
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Status
                </p>
                <StatusPicker
                  value={entry?.status}
                  onChange={(s) => {
                    setStatus(game.id, s);
                    pushToast(s ? `Marked as ${STATUS_LABEL[s]}` : "Status cleared");
                  }}
                />
              </div>
              <div className="mt-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Would you recommend this?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = entry?.recommend === true ? undefined : true;
                      setRecommend(game.id, next);
                      pushToast(next ? "Marked as recommended" : "Recommendation cleared");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      entry?.recommend === true
                        ? "border-accent-500 bg-accent-500/15 text-accent-400"
                        : "border-ink-600 text-ink-300 hover:border-ink-400 hover:text-ink-100"
                    }`}
                  >
                    <ThumbsUp size={14} /> Recommended
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = entry?.recommend === false ? undefined : false;
                      setRecommend(game.id, next);
                      pushToast(next === false ? "Marked as not recommended" : "Recommendation cleared");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      entry?.recommend === false
                        ? "border-ink-300 bg-white/10 text-white"
                        : "border-ink-600 text-ink-300 hover:border-ink-400 hover:text-ink-100"
                    }`}
                  >
                    <ThumbsDown size={14} /> Not recommended
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Your review
                </p>
                <textarea
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  placeholder="What did you think?"
                  rows={3}
                  className="w-full rounded-xl border border-ink-700 bg-ink-900 p-3 text-sm text-ink-100 outline-none focus:border-accent-500/50"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={handleSaveReview}
                    className="rounded-full bg-accent-500 px-4 py-1.5 text-sm font-bold text-ink-950 transition hover:bg-accent-400"
                  >
                    Save review
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 font-display text-lg font-bold text-white">
                Reviews ({reviews.length + (entry?.review ? 1 : 0)})
              </h2>
              <div className="flex flex-col divide-y divide-ink-800">
                {entry?.review && (
                  <div className="py-4">
                    <div className="flex items-start gap-3">
                      <Avatar seed="you" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-ink-100">You</span>
                          {entry.rating ? <StarRating value={entry.rating} readOnly size={13} /> : null}
                          <RecommendBadge recommend={entry.recommend} />
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                          {entry.review}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="py-4">
                    <div className="flex items-start gap-3">
                      <Avatar seed={r.username} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-ink-100">{r.username}</span>
                          <StarRating value={r.rating} readOnly size={13} />
                          <RecommendBadge recommend={r.recommend} />
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{r.text}</p>
                        <p className="mt-1 text-xs text-ink-500">{timeAgo(r.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && !entry?.review && (
                  <p className="py-6 text-sm text-ink-400">
                    No reviews yet — be the first to log your thoughts above.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
                <MessageSquare size={18} className="text-accent-400" /> Nostalgia corner (
                {comments.length})
              </h2>
              <form onSubmit={handlePostComment} className="glass mb-4 flex flex-col gap-2 rounded-2xl p-4">
                <textarea
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  placeholder="Got a memory of this one? Drop it here…"
                  rows={2}
                  className="input resize-none"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="input flex-1 sm:max-w-[200px]"
                  />
                  <button
                    type="submit"
                    disabled={postingComment || !commentDraft.trim()}
                    className="ml-auto rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-ink-950 transition hover:bg-accent-400 disabled:opacity-60"
                  >
                    Post
                  </button>
                </div>
              </form>
              <div className="flex flex-col divide-y divide-ink-800">
                {comments.map((c) => (
                  <div key={c.id} className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink-100">{c.authorName}</span>
                      <span className="text-xs text-ink-500">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-300">{c.body}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="py-4 text-sm text-ink-400">No comments yet — share a memory above.</p>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit glass rounded-2xl p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Where to buy</h2>
            <div className="flex flex-col gap-3">
              {STORE_ORDER.filter((key) => game.stores[key]).map((key) => {
                const link = game.stores[key]!;
                const live = bestDealFor(key);
                return (
                  <a
                    key={key}
                    href={live?.dealUrl ?? link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-glow-hover glass flex items-center justify-between rounded-xl p-3.5"
                  >
                    <div>
                      <StoreBadge store={key} />
                      {live ? (
                        <div className="mt-2 flex items-center gap-2">
                          {live.savingsPct > 0 && (
                            <span className="text-xs text-ink-400 line-through">
                              {formatPrice(live.normalPrice)}
                            </span>
                          )}
                          <span className="font-display text-base font-bold text-accent-400">
                            {formatPrice(live.salePrice)}
                          </span>
                          {live.savingsPct > 0 && (
                            <span className="rounded-full bg-accent-500/15 px-1.5 py-0.5 text-[10px] font-bold text-accent-400">
                              -{live.savingsPct}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-ink-400">View store page for price</p>
                      )}
                    </div>
                    <ExternalLink size={16} className="shrink-0 text-ink-400" />
                  </a>
                );
              })}
              {STORE_ORDER.every((key) => !game.stores[key]) && (
                <p className="text-sm text-ink-400">No storefronts linked for this title yet.</p>
              )}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              Prices refresh from a live cross-store feed when available and
              always link straight to the official storefront to buy.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
