import { isRawgConfigured, searchGamesComprehensive } from "./rawgApi";
import { searchGamesWikipedia } from "./wikipediaApi";

const API_BASE = "https://www.cheapshark.com/api/1.0";

export interface GameSearchResult {
  title: string;
  cover: string;
  year?: number;
  platforms?: string[];
  source: "rawg" | "wikipedia" | "steam";
}

interface CheapSharkGame {
  external: string;
  steamAppID: string | null;
  thumb: string;
}

/**
 * Live title search against CheapShark's game index — this only covers
 * games that exist on Steam. Used as the last-resort fallback. Fails
 * silently (empty array) on any network error so the caller can fall back
 * to manual entry.
 */
async function searchSteamOnly(query: string): Promise<GameSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(
      `${API_BASE}/games?title=${encodeURIComponent(trimmed)}&limit=8`,
      { signal: controller.signal },
    );
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as CheapSharkGame[];
    if (!Array.isArray(data)) return [];
    return data
      .filter((g) => g.external)
      .map((g) => ({ title: g.external, cover: g.thumb, source: "steam" as const }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Searches the widest catalog available, in order:
 * 1. RAWG (every platform, 1990s consoles through today) — only if a free
 *    API key is configured (VITE_RAWG_API_KEY).
 * 2. Wikipedia's public search — no signup needed at all, covers nearly
 *    every notable game ever released, but no structured platform data.
 * 3. CheapShark's Steam-only index, as a last resort.
 * Never throws — an empty array just means "nothing found, fall back to
 * manual entry".
 */
export async function searchAnyGame(query: string): Promise<GameSearchResult[]> {
  if (isRawgConfigured) {
    const rawg = await searchGamesComprehensive(query);
    if (rawg.length > 0) {
      return rawg.map((r) => ({
        title: r.title,
        cover: r.cover,
        year: r.year,
        platforms: r.platforms,
        source: "rawg" as const,
      }));
    }
  }

  const wiki = await searchGamesWikipedia(query);
  if (wiki.length > 0) {
    return wiki.map((r) => ({
      title: r.title,
      cover: r.cover,
      year: r.year,
      platforms: r.platforms,
      source: "wikipedia" as const,
    }));
  }

  return searchSteamOnly(query);
}
