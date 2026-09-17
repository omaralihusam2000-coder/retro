import { isRawgConfigured, searchGamesComprehensive } from "./rawgApi";

const API_BASE = "https://www.cheapshark.com/api/1.0";

export interface GameSearchResult {
  title: string;
  cover: string;
  year?: number;
  platforms?: string[];
  source: "rawg" | "steam";
}

interface CheapSharkGame {
  external: string;
  steamAppID: string | null;
  thumb: string;
}

/**
 * Live title search against CheapShark's game index — this only covers
 * games that exist on Steam. Used as a fallback when RAWG isn't configured,
 * or RAWG comes back empty. Fails silently (empty array) on any network
 * error so the caller can fall back to manual entry.
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
 * Searches the widest catalog available: RAWG (every platform, 1990s
 * consoles through today) when an API key is configured, otherwise
 * CheapShark's Steam-only index. Never throws — an empty array just means
 * "nothing found here, fall back to manual entry".
 */
export async function searchAnyGame(query: string): Promise<GameSearchResult[]> {
  if (isRawgConfigured) {
    const results = await searchGamesComprehensive(query);
    if (results.length > 0) {
      return results.map((r) => ({
        title: r.title,
        cover: r.cover,
        year: r.year,
        platforms: r.platforms,
        source: "rawg" as const,
      }));
    }
  }
  return searchSteamOnly(query);
}
