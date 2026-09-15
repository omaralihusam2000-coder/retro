import { games } from "./gamesData";
import type { LiveDeal, StoreKey } from "./types";

interface BasePrice {
  gameId: string;
  price: number;
  discount: Partial<Record<StoreKey, number>>;
}

const basePrices: BasePrice[] = [
  { gameId: "cyberpunk2077", price: 59.99, discount: { steam: 50, gog: 50, epic: 40 } },
  { gameId: "witcher3", price: 39.99, discount: { steam: 80, gog: 80, epic: 75 } },
  { gameId: "hades", price: 24.99, discount: { steam: 40, gog: 40, epic: 40 } },
  { gameId: "stardewvalley", price: 14.99, discount: { steam: 20, gog: 10, epic: 20 } },
  { gameId: "hollowknight", price: 14.99, discount: { steam: 50, gog: 40, epic: 50 } },
  { gameId: "discoelysium", price: 39.99, discount: { steam: 60, gog: 60, epic: 50 } },
  { gameId: "terraria", price: 9.99, discount: { steam: 50, gog: 25 } },
  { gameId: "celeste", price: 19.99, discount: { steam: 75, gog: 60, epic: 50 } },
  { gameId: "deadcells", price: 24.99, discount: { steam: 66, gog: 50, epic: 60 } },
  { gameId: "rdr2", price: 59.99, discount: { steam: 67, epic: 67 } },
  { gameId: "gtav", price: 29.99, discount: { steam: 70, epic: 60 } },
  { gameId: "doometernal", price: 39.99, discount: { steam: 75, epic: 70 } },
  { gameId: "dos2", price: 44.99, discount: { steam: 70, gog: 70, epic: 60 } },
  { gameId: "slaythespire", price: 24.99, discount: { steam: 50, gog: 40, epic: 40 } },
  { gameId: "undertale", price: 9.99, discount: { steam: 40, gog: 30 } },
  { gameId: "ittakestwo", price: 39.99, discount: { steam: 60, epic: 60 } },
  { gameId: "vampiresurvivors", price: 4.99, discount: { steam: 20, gog: 10, epic: 10 } },
  { gameId: "cultofthelamb", price: 24.99, discount: { steam: 40, gog: 30, epic: 40 } },
  { gameId: "control", price: 29.99, discount: { steam: 75, epic: 70 } },
  { gameId: "eldenring", price: 59.99, discount: { steam: 30 } },
  { gameId: "sekiro", price: 59.99, discount: { steam: 50 } },
  { gameId: "darksouls3", price: 39.99, discount: { steam: 75 } },
  { gameId: "outerwilds", price: 24.99, discount: { steam: 60, epic: 50 } },
  { gameId: "cuphead", price: 19.99, discount: { steam: 50, gog: 40, epic: 50 } },
  { gameId: "firewatch", price: 19.99, discount: { steam: 75, gog: 60, epic: 60 } },
  { gameId: "hyperlightdrifter", price: 19.99, discount: { steam: 60, gog: 50, epic: 50 } },
  { gameId: "katanazero", price: 14.99, discount: { steam: 40, gog: 30, epic: 40 } },
  { gameId: "inscryption", price: 19.99, discount: { steam: 40, gog: 30, epic: 30 } },
  { gameId: "inside", price: 19.99, discount: { steam: 75, gog: 60, epic: 60 } },
  { gameId: "limbo", price: 9.99, discount: { steam: 75, gog: 60, epic: 60 } },
  { gameId: "tunic", price: 29.99, discount: { steam: 30, gog: 25, epic: 25 } },
  { gameId: "loophero", price: 14.99, discount: { steam: 50, gog: 40, epic: 40 } },
  { gameId: "subnautica", price: 29.99, discount: { steam: 75, epic: 60 } },
  { gameId: "riskofrain2", price: 24.99, discount: { steam: 60, epic: 50 } },
];

const storeNames: Record<StoreKey, string> = {
  steam: "Steam",
  epic: "Epic Games Store",
  gog: "GOG",
};

export function buildFallbackDeals(): LiveDeal[] {
  const deals: LiveDeal[] = [];
  for (const entry of basePrices) {
    const game = games.find((g) => g.id === entry.gameId);
    if (!game) continue;
    for (const [storeKey, pct] of Object.entries(entry.discount) as [StoreKey, number][]) {
      const link = game.stores[storeKey];
      if (!link) continue;
      const salePrice = Math.max(0.49, Math.round(entry.price * (1 - pct / 100) * 100) / 100);
      deals.push({
        id: `${game.id}-${storeKey}`,
        gameTitle: game.title,
        storeKey,
        storeName: storeNames[storeKey],
        salePrice,
        normalPrice: entry.price,
        savingsPct: pct,
        thumb: game.cover,
        dealUrl: link.url,
      });
    }
  }
  return deals.sort((a, b) => b.savingsPct - a.savingsPct);
}
