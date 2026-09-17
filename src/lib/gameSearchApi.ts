const API_BASE = "https://www.cheapshark.com/api/1.0";

export interface GameSearchResult {
  title: string;
  steamAppID: string | null;
  thumb: string;
}

interface CheapSharkGame {
  external: string;
  steamAppID: string | null;
  thumb: string;
}

/**
 * Live title search against CheapShark's game index — this only covers
 * games that exist on Steam, so it's a helpful shortcut for modern titles,
 * not a universal database of every game ever made. Fails silently (empty
 * array) on any network error so the caller can fall back to manual entry.
 */
export async function searchGamesLive(query: string): Promise<GameSearchResult[]> {
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
      .map((g) => ({ title: g.external, steamAppID: g.steamAppID, thumb: g.thumb }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
