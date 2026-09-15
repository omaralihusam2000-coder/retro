import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { getDeals } from "../lib/dealsApi";
import type { LiveDeal, StoreKey } from "../lib/types";
import DealCard from "../components/DealCard";
import { DealGridSkeleton } from "../components/Skeleton";

type StoreFilter = "all" | StoreKey;
type SortKey = "savings" | "price-asc" | "price-desc" | "title";

const STORE_TABS: { key: StoreFilter; label: string }[] = [
  { key: "all", label: "All Stores" },
  { key: "steam", label: "Steam" },
  { key: "epic", label: "Epic Games" },
  { key: "gog", label: "GOG" },
];

export default function Deals() {
  const [deals, setDeals] = useState<LiveDeal[] | null>(null);
  const [source, setSource] = useState<"live" | "sample" | null>(null);
  const [store, setStore] = useState<StoreFilter>("all");
  const [sort, setSort] = useState<SortKey>("savings");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setDeals(null);
    getDeals(90).then((res) => {
      if (cancelled) return;
      setDeals(res.deals);
      setSource(res.source);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filtered = useMemo(() => {
    if (!deals) return [];
    let list = deals;
    if (store !== "all") list = list.filter((d) => d.storeKey === store);
    if (maxPrice !== null) list = list.filter((d) => d.salePrice <= maxPrice);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((d) => d.gameTitle.toLowerCase().includes(q));
    }
    const sorted = [...list];
    switch (sort) {
      case "savings":
        sorted.sort((a, b) => b.savingsPct - a.savingsPct);
        break;
      case "price-asc":
        sorted.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "title":
        sorted.sort((a, b) => a.gameTitle.localeCompare(b.gameTitle));
        break;
    }
    return sorted;
  }, [deals, store, query, sort, maxPrice]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-500">
          Deal Radar
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Live deals, straight to checkout
          </h1>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs font-semibold text-ink-200 transition hover:border-neon-500/50 hover:text-neon-400"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
        <p className="max-w-2xl text-sm text-ink-400">
          Pulled from a live cross-store deal index and matched against Steam,
          Epic Games Store and GOG listings. Every card links directly to the
          real store page to complete the purchase.{" "}
          {source && (
            <span className={source === "live" ? "text-neon-400" : "text-amber-400"}>
              {source === "live"
                ? "Showing live prices right now."
                : "Live feed unreachable — showing curated sample pricing."}
            </span>
          )}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STORE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStore(tab.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                store === tab.key
                  ? "bg-neon-500 text-ink-950"
                  : "bg-ink-800 text-ink-300 hover:bg-ink-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title…"
              className="w-44 rounded-full border border-ink-700 bg-ink-800 py-2 pl-8 pr-3 text-sm text-ink-100 outline-none focus:border-neon-500/50 sm:w-56"
            />
          </div>
          <select
            value={maxPrice ?? "any"}
            onChange={(e) => setMaxPrice(e.target.value === "any" ? null : Number(e.target.value))}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-neon-500/50"
          >
            <option value="any">Any price</option>
            <option value="5">Under $5</option>
            <option value="10">Under $10</option>
            <option value="20">Under $20</option>
            <option value="30">Under $30</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-neon-500/50"
          >
            <option value="savings">Biggest discount</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>

      {deals === null ? (
        <DealGridSkeleton count={15} />
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-ink-400">No deals match those filters right now.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
