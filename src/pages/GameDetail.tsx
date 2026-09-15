import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, Star } from "lucide-react";
import { getGameBySlug } from "../lib/gamesData";
import { getDeals } from "../lib/dealsApi";
import type { LiveDeal, LogStatus, StoreKey } from "../lib/types";
import { formatCompactNumber, formatPrice } from "../lib/format";
import { useUserStore } from "../lib/store";
import { useToastStore } from "../lib/toastStore";
import { reviewsForGame } from "../data/reviewsMock";
import PosterImage from "../components/PosterImage";
import StarRating from "../components/StarRating";
import StoreBadge from "../components/StoreBadge";
import StatusPicker from "../components/StatusPicker";
import AddToListMenu from "../components/AddToListMenu";
import Avatar from "../components/Avatar";
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
  const game = slug ? getGameBySlug(slug) : undefined;
  const [liveDeals, setLiveDeals] = useState<LiveDeal[]>([]);

  const entry = useUserStore((s) => (game ? s.logs[game.id] : undefined));
  const setRating = useUserStore((s) => s.setRating);
  const setStatus = useUserStore((s) => s.setStatus);
  const setReview = useUserStore((s) => s.setReview);
  const addRecentlyViewed = useUserStore((s) => s.addRecentlyViewed);
  const [reviewDraft, setReviewDraft] = useState(entry?.review ?? "");
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    if (game) addRecentlyViewed(game.id);
  }, [game, addRecentlyViewed]);

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
        <Link to="/games" className="mt-4 inline-block text-neon-400 hover:underline">
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
          <div className="poster w-36 shrink-0 overflow-hidden rounded-xl border-2 border-ink-700 shadow-2xl sm:w-52">
            <PosterImage src={game.cover} title={game.title} />
          </div>
          <div className="flex-1 pb-4 pt-2 sm:pt-20">
            <h1 className="font-display text-2xl font-bold text-white sm:text-4xl">{game.title}</h1>
            <p className="mt-1 text-sm text-ink-300 sm:text-base">
              {game.year} &middot; {game.developer}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {game.genres.map((g) => (
                <Link
                  key={g}
                  to={`/genres/${encodeURIComponent(g)}`}
                  className="rounded-full bg-ink-800 px-2.5 py-1 text-xs font-medium text-ink-300 transition hover:bg-ink-700 hover:text-neon-400"
                >
                  {g}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-300">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-ink-100">{game.communityRating.toFixed(1)}</span>
              <span>average &middot; {formatCompactNumber(game.ratingCount)} ratings</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-10 pb-16 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="max-w-2xl text-base leading-relaxed text-ink-200">{game.description}</p>

            <div className="mt-8 rounded-xl border border-ink-800 bg-ink-900/40 p-5">
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
                <AddToListMenu gameId={game.id} />
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
                  Your review
                </p>
                <textarea
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  placeholder="What did you think?"
                  rows={3}
                  className="w-full rounded-lg border border-ink-700 bg-ink-900 p-3 text-sm text-ink-100 outline-none focus:border-neon-500/50"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={handleSaveReview}
                    className="rounded-full bg-neon-500 px-4 py-1.5 text-sm font-bold text-ink-950 transition hover:bg-neon-400"
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink-100">You</span>
                          {entry.rating ? <StarRating value={entry.rating} readOnly size={13} /> : null}
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
          </div>

          <aside className="h-fit rounded-xl border border-ink-800 bg-ink-900/40 p-5">
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
                    className="card-glow-hover flex items-center justify-between rounded-lg border border-ink-700 bg-ink-800 p-3.5"
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
                          <span className="font-display text-base font-bold text-neon-400">
                            {formatPrice(live.salePrice)}
                          </span>
                          {live.savingsPct > 0 && (
                            <span className="rounded-full bg-neon-500/15 px-1.5 py-0.5 text-[10px] font-bold text-neon-400">
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
