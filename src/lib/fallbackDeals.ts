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
  { gameId: "portal", price: 9.99, discount: { steam: 50 } },
  { gameId: "balatro", price: 14.99, discount: { steam: 20, gog: 15, epic: 20 } },
  { gameId: "amongus", price: 4.99, discount: { steam: 25, gog: 20, epic: 25 } },
  { gameId: "superliminal", price: 19.99, discount: { steam: 60, gog: 50, epic: 50 } },
  { gameId: "stanleyparable", price: 19.99, discount: { steam: 25, gog: 20, epic: 20 } },
  { gameId: "untitledgoosegame", price: 19.99, discount: { steam: 40, epic: 35 } },
  { gameId: "edithfinch", price: 19.99, discount: { steam: 60, epic: 50 } },
  { gameId: "halflife", price: 9.99, discount: { steam: 90 } },
  { gameId: "doom1993", price: 4.99, discount: { steam: 50, gog: 50 } },
  { gameId: "fallout1", price: 9.99, discount: { steam: 75, gog: 70 } },
  { gameId: "fallout2", price: 9.99, discount: { steam: 75, gog: 70 } },
  { gameId: "falloutnv", price: 9.99, discount: { steam: 75, gog: 75 } },
  { gameId: "fallout3", price: 19.99, discount: { steam: 75, gog: 75 } },
  { gameId: "skyrim", price: 39.99, discount: { steam: 67 } },
  { gameId: "bgee", price: 19.99, discount: { steam: 60, gog: 60 } },
  { gameId: "systemshock2", price: 19.99, discount: { steam: 60, gog: 60 } },
  { gameId: "deusex", price: 9.99, discount: { steam: 75, gog: 75 } },
  { gameId: "grimfandango", price: 14.99, discount: { steam: 75, gog: 70 } },
  { gameId: "amnesia", price: 19.99, discount: { steam: 75, gog: 75 } },
  { gameId: "bioshock", price: 19.99, discount: { steam: 75 } },
  { gameId: "dragonageorigins", price: 19.99, discount: { steam: 75 } },
  { gameId: "dishonored", price: 19.99, discount: { steam: 75 } },
  { gameId: "nierautomata", price: 39.99, discount: { steam: 60 } },
  { gameId: "valheim", price: 19.99, discount: { steam: 20 } },
  { gameId: "deeprockgalactic", price: 29.99, discount: { steam: 60 } },
  { gameId: "dontstarvetogether", price: 14.99, discount: { steam: 60, gog: 50 } },
  { gameId: "dontstarve", price: 14.99, discount: { steam: 75, gog: 70 } },
  { gameId: "rimworld", price: 34.99, discount: { steam: 15, gog: 15 } },
  { gameId: "kerbalspaceprogram", price: 39.99, discount: { steam: 75, gog: 70 } },
  { gameId: "citiesskylines", price: 27.99, discount: { steam: 85, gog: 80 } },
  { gameId: "frostpunk", price: 29.99, discount: { steam: 80, gog: 80 } },
  { gameId: "crusaderkings3", price: 49.99, discount: { steam: 40, gog: 40 } },
  { gameId: "eu4", price: 39.99, discount: { steam: 75, gog: 75 } },
  { gameId: "civ6", price: 59.99, discount: { steam: 75, epic: 75 } },
  { gameId: "intothebreach", price: 14.99, discount: { steam: 40, gog: 30, epic: 30 } },
  { gameId: "darkestdungeon", price: 24.99, discount: { steam: 75, gog: 75, epic: 66 } },
  { gameId: "ftl", price: 9.99, discount: { steam: 75, gog: 75 } },
  { gameId: "enterthegungeon", price: 17.99, discount: { steam: 75, gog: 70, epic: 75 } },
  { gameId: "nuclearthrone", price: 11.99, discount: { steam: 50, gog: 50 } },
  { gameId: "moonlighter", price: 17.99, discount: { steam: 75, gog: 75, epic: 75 } },
  { gameId: "shovelknight", price: 29.99, discount: { steam: 30, gog: 30 } },
  { gameId: "blasphemous", price: 24.99, discount: { steam: 75, gog: 75, epic: 75 } },
  { gameId: "saltandsanctuary", price: 17.99, discount: { steam: 70, gog: 70 } },
  { gameId: "rainworld", price: 19.99, discount: { steam: 60, gog: 60 } },
  { gameId: "persona5royal", price: 59.99, discount: { steam: 40 } },
  { gameId: "nomanssky", price: 59.99, discount: { steam: 50, gog: 50, epic: 50 } },
  { gameId: "alanwake2", price: 59.99, discount: { steam: 30, epic: 30 } },
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
