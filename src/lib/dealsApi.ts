import type { LiveDeal, StoreKey } from "./types";
import { buildFallbackDeals } from "./fallbackDeals";

const API_BASE = "https://www.cheapshark.com/api/1.0";

interface CheapSharkStore {
  storeID: string;
  storeName: string;
  isActive: number;
}

interface CheapSharkDeal {
  dealID: string;
  title: string;
  storeID: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  thumb: string;
  metacriticScore: string;
  steamRatingText: string;
}

function matchStoreKey(storeName: string): StoreKey | null {
  const n = storeName.toLowerCase();
  if (n.includes("steam")) return "steam";
  if (n.includes("epic")) return "epic";
  if (n === "gog" || n.includes("gog.com") || n.includes("gog ")) return "gog";
  return null;
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

export async function fetchLiveDeals(limit = 60): Promise<LiveDeal[]> {
  const [storesRes, dealsRes] = await Promise.all([
    fetchWithTimeout(`${API_BASE}/stores`, 7000),
    fetchWithTimeout(`${API_BASE}/deals?pageSize=${limit}&sortBy=Savings&onSale=1`, 7000),
  ]);

  const stores: CheapSharkStore[] = await storesRes.json();
  const deals: CheapSharkDeal[] = await dealsRes.json();

  const storeMap = new Map<string, { key: StoreKey; name: string }>();
  for (const s of stores) {
    const key = matchStoreKey(s.storeName);
    if (key) storeMap.set(s.storeID, { key, name: s.storeName });
  }

  const mapped: LiveDeal[] = [];
  for (const d of deals) {
    const store = storeMap.get(d.storeID);
    if (!store) continue;
    const savingsPct = Math.round(parseFloat(d.savings));
    const salePrice = parseFloat(d.salePrice);
    const normalPrice = parseFloat(d.normalPrice);
    if (!Number.isFinite(salePrice) || !Number.isFinite(normalPrice)) continue;
    mapped.push({
      id: d.dealID,
      gameTitle: d.title,
      storeKey: store.key,
      storeName: store.name,
      salePrice,
      normalPrice,
      savingsPct,
      thumb: d.thumb,
      dealUrl: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
      metacritic: d.metacriticScore ? Number(d.metacriticScore) : undefined,
      steamRatingText: d.steamRatingText || undefined,
    });
  }

  if (mapped.length === 0) throw new Error("No matching deals returned");
  return mapped;
}

export interface DealsResult {
  deals: LiveDeal[];
  source: "live" | "sample";
}

export async function getDeals(limit = 60): Promise<DealsResult> {
  try {
    const deals = await fetchLiveDeals(limit);
    return { deals, source: "live" };
  } catch {
    return { deals: buildFallbackDeals(), source: "sample" };
  }
}
