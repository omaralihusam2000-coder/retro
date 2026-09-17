export interface ComprehensiveSearchResult {
  title: string;
  year?: number;
  cover: string;
  platforms: string[];
}

interface WikiPage {
  pageid: number;
  title: string;
  thumbnail?: { source: string };
  description?: string;
}

interface WikiQueryResponse {
  query?: { pages?: Record<string, WikiPage> };
}

function extractYear(description?: string): number | undefined {
  if (!description) return undefined;
  const match = description.match(/\b(19[5-9]\d|20[0-4]\d)\b/);
  return match ? Number(match[1]) : undefined;
}

/**
 * Zero-signup, keyless full-catalog search via Wikipedia's public MediaWiki
 * API (CORS enabled through origin=*, no key or account needed). Covers
 * essentially every notable game ever released since almost all of them
 * have a Wikipedia article, but doesn't give structured platform data and
 * occasionally returns a tangentially related non-game page — filtered
 * down to results whose short description mentions "game".
 */
export async function searchGamesWikipedia(query: string): Promise<ComprehensiveSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&generator=search" +
      `&gsrsearch=${encodeURIComponent(`${trimmed} video game`)}` +
      "&gsrlimit=8&prop=pageimages%7Cdescription&piprop=thumbnail&pithumbsize=300" +
      "&format=json&origin=*";
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as WikiQueryResponse;
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];
    return pages
      .filter((p) => /\bgame\b/i.test(p.description ?? ""))
      .map((p) => ({
        title: p.title,
        year: extractYear(p.description),
        cover: p.thumbnail?.source ?? "",
        platforms: [],
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
