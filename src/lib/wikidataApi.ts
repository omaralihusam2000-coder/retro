const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

/**
 * Batch-fetches platform names (Wikidata property P400) for a set of
 * Wikidata item IDs (e.g. "Q12345") in a single SPARQL query. Wikidata is
 * the structured, open-data (CC0) sister project to Wikipedia — same
 * Wikimedia Foundation infrastructure, no key or account needed, CORS
 * enabled. Returns a map of Q-id -> platform names; missing/failed lookups
 * are simply absent from the map rather than throwing.
 */
export async function fetchPlatformsForItems(qids: string[]): Promise<Record<string, string[]>> {
  const unique = Array.from(new Set(qids)).filter(Boolean);
  if (unique.length === 0) return {};

  const values = unique.map((q) => `wd:${q}`).join(" ");
  const query = `SELECT ?item ?platformLabel WHERE {
    VALUES ?item { ${values} }
    ?item wdt:P400 ?platform.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`, {
      signal: controller.signal,
      headers: { Accept: "application/sparql-results+json" },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as {
      results?: { bindings?: { item?: { value: string }; platformLabel?: { value: string } }[] };
    };
    const result: Record<string, string[]> = {};
    for (const binding of data.results?.bindings ?? []) {
      const qid = binding.item?.value?.split("/").pop();
      const label = binding.platformLabel?.value;
      if (!qid || !label) continue;
      (result[qid] ??= []);
      if (!result[qid].includes(label)) result[qid].push(label);
    }
    return result;
  } catch {
    return {};
  } finally {
    clearTimeout(timer);
  }
}
