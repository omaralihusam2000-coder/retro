import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Tag, Users } from "lucide-react";
import { games } from "../lib/gamesData";
import { activityFeed } from "../data/activityMock";
import { getDeals } from "../lib/dealsApi";
import type { LiveDeal } from "../lib/types";
import GameCard from "../components/GameCard";
import DealCard from "../components/DealCard";
import ActivityItem from "../components/ActivityItem";
import SectionHeader from "../components/SectionHeader";
import PosterImage from "../components/PosterImage";
import Loader from "../components/Loader";

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

  useEffect(() => {
    let cancelled = false;
    getDeals(12).then((res) => {
      if (cancelled) return;
      setDeals(res.deals.slice(0, 6));
      setDealSource(res.source);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trending = [...games].sort((a, b) => b.communityRating - a.communityRating).slice(0, 12);

  return (
    <div>
      <section className="scanlines relative flex min-h-[560px] items-center overflow-hidden border-b border-ink-800">
        <HeroBackdrop />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-500/30 bg-neon-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon-400">
            <Sparkles size={13} /> Your backlog, tracked properly
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
            Log every game.
            <br />
            <span className="text-gradient-neon">Rate it. Hunt the deal.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink-200 sm:text-lg">
            Retro is the social diary for gamers — rate what you play, build
            lists, follow the community, and jump straight to the cheapest
            real listing on Steam, Epic Games or GOG.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 rounded-full bg-neon-500 px-6 py-3 font-display text-sm font-bold text-ink-950 shadow-glow-neon transition hover:bg-neon-400"
            >
              Browse Games <ArrowRight size={16} />
            </Link>
            <Link
              to="/deals"
              className="inline-flex items-center gap-2 rounded-full border border-ink-500 bg-ink-900/60 px-6 py-3 font-display text-sm font-bold text-ink-100 backdrop-blur transition hover:border-neon-500/50"
            >
              <Tag size={16} /> See Live Deals
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-300">
            <Stat value={`${games.length}+`} label="games tracked" />
            <Stat value="3" label="storefronts linked" />
            <Stat value="24/7" label="deal scanning" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader eyebrow="Trending" title="Most acclaimed on Retro" action="/games" />
        <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {trending.map((game) => (
            <div key={game.id} className="w-36 shrink-0 sm:w-44">
              <GameCard game={game} />
            </div>
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
                        ? "bg-neon-500/15 text-neon-400"
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
            <Loader label="Scanning storefronts" />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
          <div className="rounded-xl border border-ink-800 bg-ink-900/40 px-4">
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
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-neon-500/10 text-neon-400">
        <Icon size={18} />
      </div>
      <h3 className="mb-1.5 font-display font-semibold text-ink-100">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-400">{body}</p>
    </div>
  );
}
