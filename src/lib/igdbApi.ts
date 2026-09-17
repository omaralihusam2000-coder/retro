const API_BASE = "https://api.igdb.com/v4";

export interface ComprehensiveSearchResult {
  title: string;
  year?: number;
  cover: string;
  platforms: string[];
}

interface IgdbGame {
  name: string;
  first_release_date?: number;
  cover?: { url?: string };
  platforms?: { name: string }[];
}

export const isIgdbConfigured = Boolean(
  import.meta.env.VITE_IGDB_CLIENT_ID && import.meta.env.VITE_IGDB_ACCESS_TOKEN,
);

/**
 * IGDB is the most complete, best-curated game database around, but it's
 * gated behind Twitch OAuth. Since this is a static site with no backend to
 * hide a client secret in, the token exchange happens once per deploy in
 * the GitHub Actions workflow (see .github/workflows/deploy.yml) — only the
 * Client ID (not secret) and a short-lived access token ever reach this
 * bundle, never the actual Twitch client secret.
 */
export async function searchGamesIgdb(query: string): Promise<ComprehensiveSearchResult[]> {
  const clientId = import.meta.env.VITE_IGDB_CLIENT_ID;
  const token = import.meta.env.VITE_IGDB_ACCESS_TOKEN;
  const trimmed = query.trim();
  if (!clientId || !token || trimmed.length < 2) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${API_BASE}/games`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: `search "${trimmed.replace(/"/g, '\\"')}"; fields name,first_release_date,cover.url,platforms.name; limit 8;`,
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as IgdbGame[];
    if (!Array.isArray(data)) return [];
    return data
      .filter((g) => g.name)
      .map((g) => ({
        title: g.name,
        year: g.first_release_date
          ? new Date(g.first_release_date * 1000).getFullYear()
          : undefined,
        cover: g.cover?.url ? `https:${g.cover.url.replace("t_thumb", "t_cover_big")}` : "",
        platforms: (g.platforms ?? []).map((p) => p.name),
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
