import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, Calendar, Sparkles, Tag, Users } from "lucide-react";
import { games, getGameById } from "../lib/gamesData";
import { activityFeed } from "../data/activityMock";
import { upcomingGames } from "../data/upcomingGames";
import { getDeals } from "../lib/dealsApi";
import { fetchSuggestions } from "../lib/community";
import type { LiveDeal, Suggestion } from "../lib/types";
import { useUserStore } from "../lib/store";
import { useCatalogStore } from "../lib/catalogStore";
import { computeStats } from "../lib/stats";
import GameCard from "../components/GameCard";
import DealCard from "../components/DealCard";
import ActivityItem from "../components/ActivityItem";
import SectionHeader from "../components/SectionHeader";
import PosterImage from "../components/PosterImage";
import { DealGridSkeleton } from "../components/Skeleton";

const HERO_GAMES = [games[3], games[2], games[4], games[6]];

function HeroBackdrop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_GAMES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={HERO_GAMES[index].id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <PosterImage
            src={HERO_GAMES[index].backdrop}
            title={HERO_GAMES[index].title}
            className="opacity-60"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/20 to-transparent" />
    </div>
  );
}

export default function Home() {
  const [deals, setDeals] = useState<LiveDeal[] | null>(null);
  const [dealSource, setDealSource] = useState<"live" | "sample" | null>(null);
  const [topSuggestions, setTopSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    let cancelled = false;
    getDeals(24).then((res) => {
      if (cancelled) return;
      setDeals(res.deals.slice(0, 8));
      setDealSource(res.source);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchSuggestions().then((data) => {
      if (!cancelled) setTopSuggestions(data.filter((s) => s.votes > 0).slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trending = [...games].sort((a, b) => b.communityRating - a.communityRating).slice(0, 12);
  const liveGamesCount = useCatalogStore((s) => s.liveGames.length);
  const totalGamesCount = games.length + liveGamesCount;

  const logs = useUserStore((s) => s.logs);
  const recentlyViewedIds = useUserStore((s) => s.recentlyViewed);
  const recentlyViewed = recentlyViewedIds
    .map((id) => getGameById(id))
    .filter((g): g is (typeof games)[number] => !!g);

  const stats = computeStats(logs);
  const recommended = stats.favoriteGenre
    ? games
        .filter((g) => g.genres.includes(stats.favoriteGenre!) && !logs[g.id])
        .sort((a, b) => b.communityRating - a.communityRating)
        .slice(0, 12)
    : [];

  return (
    <div>
      <section className="relative flex min-h-[560px] items-center overflow-hidden border-b border-ink-800">
        <HeroBackdrop />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-400">
            <Sparkles size={13} /> Your backlog, tracked properly
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
            Log every game.
            <br />
            <span className="text-gradient-accent">Rate it. Hunt the deal.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink-200 sm:text-lg">
            Retro is the social diary for gamers — rate what you play, build
            lists, follow the community, and jump straight to the cheapest
            real listing on Steam, Epic Games or GOG.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-display text-sm font-bold text-ink-950 shadow-glow-accent transition hover:bg-accent-400"
            >
              Browse Games <ArrowRight size={16} />
            </Link>
            <Link
              to="/deals"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold text-white transition hover:border-accent-500/50"
            >
              <Tag size={16} /> See Live Deals
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-300">
            <Stat value={`${totalGamesCount}+`} label="games tracked" />
            <Stat value="3" label="storefronts linked" />
            <Stat value="24/7" label="deal scanning" />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-ink-800 bg-ink-900/60 py-2">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...trending, ...trending].map((game, i) => (
            <span key={`${game.id}-${i}`} className="font-pixel text-[10px] text-accent-400">
              ▲ HIGH SCORE — {game.title.toUpperCase()} — {(game.communityRating * 20).toFixed(0)}
              PTS
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader eyebrow="Trending" title="Most acclaimed on Retro" action="/games" />
        <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {trending.map((game, i) => (
            <div key={game.id} className="relative w-36 shrink-0 sm:w-44">
              <span
                className={`font-pixel absolute -left-1 -top-1 z-10 rounded-md px-1.5 py-0.5 text-[10px] shadow-glow-accent ${
                  i === 0
                    ? "bg-accent-500 text-ink-950"
                    : i < 3
                      ? "bg-neon-magenta text-ink-950"
                      : "bg-ink-950/90 text-accent-400 shadow-none"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>

      {topSuggestions.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <SectionHeader
            eyebrow="Community picks"
            title="What the community wants added next"
            action="/suggestions"
            actionLabel="See all suggestions"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {topSuggestions.map((s) => (
              <Link
                key={s.id}
                to="/suggestions"
                className="card-glow-hover glass flex items-center gap-3 rounded-2xl p-4"
              >
                <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg border border-ink-600 px-2.5 py-1.5 text-accent-400">
                  <ArrowUp size={14} />
                  <span className="font-display text-sm font-bold">{s.votes}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold text-white">{s.title}</p>
                  <p className="truncate text-xs text-ink-400">
                    {s.platform}
                    {s.releaseYear && ` · ${s.releaseYear}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <SectionHeader eyebrow="Pick up where you left off" title="Recently viewed" />
          <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {recentlyViewed.map((game) => (
              <div key={game.id} className="w-36 shrink-0 sm:w-44">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <SectionHeader
            eyebrow="Because you rate a lot of it"
            title={`More ${stats.favoriteGenre}`}
            action="/games"
          />
          <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {recommended.map((game) => (
              <div key={game.id} className="w-36 shrink-0 sm:w-44">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <SectionHeader eyebrow="Release radar" title="Coming soon" action="/upcoming" />
        <div className="grid gap-3 sm:grid-cols-3">
          {upcomingGames.slice(0, 3).map((game) => (
            <Link
              key={game.id}
              to="/upcoming"
              className="card-glow-hover glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-400">
                <Calendar size={13} /> {game.expectedRelease}
              </div>
              <p className="mt-2 font-display font-semibold text-white">{game.title}</p>
              <p className="mt-0.5 text-xs text-ink-400">{game.platforms.join(" · ")}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-y border-ink-800 bg-ink-900/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Real prices, right now"
            title={
              <span className="inline-flex items-center gap-2">
                Live deals across Steam, Epic &amp; GOG
                {dealSource && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      dealSource === "live"
                        ? "bg-accent-500/15 text-accent-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {dealSource === "live" ? "● Live" : "Sample"}
                  </span>
                )}
              </span>
            }
            action="/deals"
            actionLabel="View all deals"
          />
          {deals === null ? (
            <DealGridSkeleton
              count={8}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div>
          <SectionHeader eyebrow="Community" title="Fresh off the feed" action="/activity" />
          <div className="glass rounded-2xl px-4">
            {activityFeed.slice(0, 6).map((entry) => (
              <ActivityItem key={entry.id} entry={entry} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <FeatureCard
            icon={Users}
            title="Built like a social diary"
            body="Rate on a 5-star scale, write reviews, keep a running diary, and see what the rest of the community is playing."
          />
          <FeatureCard
            icon={Tag}
            title="Deals that link straight out"
            body="Every deal card jumps directly to the real Steam, Epic Games or GOG store page — no middleman checkout."
          />
          <FeatureCard
            icon={Sparkles}
            title="Lists for every mood"
            body="Cozy weekend picks, backlog shame piles, co-op nights — build and share curated lists of games."
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-xl font-bold text-white">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Users;
  title: string;
  body: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
        <Icon size={18} />
      </div>
      <h3 className="mb-1.5 font-display font-semibold text-ink-100">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-400">{body}</p>
    </div>
  );
}
