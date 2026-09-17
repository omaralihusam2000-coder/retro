const API_BASE = "https://api.rawg.io/api";

export interface ComprehensiveSearchResult {
  title: string;
  year?: number;
  cover: string;
  platforms: string[];
}

interface RawgGame {
  name: string;
  released: string | null;
  background_image: string | null;
  platforms?: { platform: { name: string } }[] | null;
}

interface RawgSearchResponse {
  results: RawgGame[];
}

export const isRawgConfigured = Boolean(import.meta.env.VITE_RAWG_API_KEY);

/**
 * Full-catalog search via RAWG.io — covers virtually every platform and era
 * (1990s consoles through today), unlike CheapShark's Steam-only index.
 * Requires a free API key (rawg.io/apidocs) set as VITE_RAWG_API_KEY; when
 * absent this returns [] immediately so callers fall back to other sources.
 */
export async function searchGamesComprehensive(query: string): Promise<ComprehensiveSearchResult[]> {
  const key = import.meta.env.VITE_RAWG_API_KEY;
  const trimmed = query.trim();
  if (!key || trimmed.length < 2) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(
      `${API_BASE}/games?key=${encodeURIComponent(key)}&search=${encodeURIComponent(trimmed)}&page_size=8`,
      { signal: controller.signal },
    );
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as RawgSearchResponse;
    if (!Array.isArray(data.results)) return [];
    return data.results.map((g) => ({
      title: g.name,
      year: g.released ? new Date(g.released).getFullYear() : undefined,
      cover: g.background_image ?? "",
      platforms: (g.platforms ?? []).map((p) => p.platform.name),
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
