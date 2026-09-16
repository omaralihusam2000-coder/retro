import { ExternalLink } from "lucide-react";
import type { LiveDeal } from "../lib/types";
import { formatPrice } from "../lib/format";
import StoreBadge from "./StoreBadge";
import PosterImage from "./PosterImage";
import { getGameBySlug } from "../lib/gamesData";
import { Link } from "react-router-dom";

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function DealCard({ deal }: { deal: LiveDeal }) {
  const localGame =
    getGameBySlug(slugifyTitle(deal.gameTitle)) ??
    undefined;

  return (
    <div className="card-glow-hover group flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-800">
      <div className="relative aspect-video overflow-hidden bg-ink-900">
        <PosterImage
          src={deal.thumb ?? ""}
          title={deal.gameTitle}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          <StoreBadge store={deal.storeKey} size="sm" />
        </div>
        {deal.savingsPct > 0 && (
          <div className="absolute right-2 top-2 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-ink-950">
            -{deal.savingsPct}%
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3 className="font-display text-sm font-semibold leading-snug text-ink-100 line-clamp-2">
          {deal.gameTitle}
        </h3>
        <div className="mt-auto flex items-center gap-2">
          {deal.normalPrice > deal.salePrice && (
            <span className="text-xs text-ink-400 line-through">
              {formatPrice(deal.normalPrice)}
            </span>
          )}
          <span className="font-display text-base font-bold text-accent-400">
            {formatPrice(deal.salePrice)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <a
            href={deal.dealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent-500 px-3 py-2 text-xs font-bold text-ink-950 transition hover:bg-accent-400"
          >
            Get Deal <ExternalLink size={13} />
          </a>
          {localGame && (
            <Link
              to={`/games/${localGame.slug}`}
              className="inline-flex items-center justify-center rounded-xl border border-ink-600 px-3 py-2 text-xs font-semibold text-ink-200 transition hover:border-accent-500/50 hover:text-accent-400"
            >
              Page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
