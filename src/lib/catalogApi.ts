import type { Game } from "./types";
import { games as curatedGames } from "./gamesData";

const API_BASE = "https://www.cheapshark.com/api/1.0";
const CACHE_KEY = "retro-live-catalog-v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

interface CheapSharkDeal {
  title: string;
  steamAppID: string | null;
  thumb: string;
}

function steamCover(appId: string) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
}
function steamBackdrop(appId: string) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero.jpg`;
}
function steamUrl(appId: string) {
  return `https://store.steampowered.com/app/${appId}`;
}

function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "game";
}

function curatedSteamAppIds(): Set<string> {
  const ids = new Set<string>();
  for (const g of curatedGames) {
    const match = g.stores.steam?.url.match(/\/app\/(\d+)/);
    if (match) ids.add(match[1]);
  }
  return ids;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchExtendedCatalogFromApi(): Promise<Game[]> {
  const excluded = curatedSteamAppIds();

  const settled = await Promise.allSettled(
    LETTERS.map((letter) =>
      fetchWithTimeout(
        `${API_BASE}/deals?pageSize=60&title=${letter}&sortBy=Title`,
        8000,
      ).then((res) => res.json() as Promise<CheapSharkDeal[]>),
    ),
  );

  const seen = new Set<string>();
  const extended: Game[] = [];

  for (const result of settled) {
    if (result.status !== "fulfilled" || !Array.isArray(result.value)) continue;
    for (const deal of result.value) {
      const appId = deal.steamAppID;
      if (!appId || !deal.title) continue;
      if (excluded.has(appId) || seen.has(appId)) continue;
      seen.add(appId);
      extended.push({
        id: `live-${appId}`,
        slug: `live-${slugifyTitle(deal.title)}-${appId}`,
        title: deal.title,
        genres: [],
        tags: [],
        description:
          "Pulled in from the live Steam catalog — rate it, review it, or add it to a list.",
        cover: steamCover(appId),
        backdrop: steamBackdrop(appId),
        stores: { steam: { url: steamUrl(appId) } },
        communityRating: 0,
        ratingCount: 0,
        isExtended: true,
      });
    }
  }

  if (extended.length === 0) throw new Error("No extended catalog entries returned");
  return extended;
}

interface CachedCatalog {
  fetchedAt: number;
  games: Game[];
}

function readCache(): Game[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCatalog;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    if (!Array.isArray(parsed.games) || parsed.games.length === 0) return null;
    return parsed.games;
  } catch {
    return null;
  }
}

function writeCache(games: Game[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), games }));
  } catch {
    /* localStorage unavailable or full — caching is a pure optimization, safe to skip */
  }
}

export async function loadExtendedCatalog(): Promise<Game[]> {
  const cached = readCache();
  if (cached) return cached;
  const fresh = await fetchExtendedCatalogFromApi();
  writeCache(fresh);
  return fresh;
}
