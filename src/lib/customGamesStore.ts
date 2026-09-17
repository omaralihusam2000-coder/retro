import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game } from "./types";

function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "game";
}

interface CustomGamesState {
  customGames: Game[];
  addCustomGame: (title: string) => Game;
}

export const useCustomGamesStore = create<CustomGamesState>()(
  persist(
    (set, get) => ({
      customGames: [],

      addCustomGame: (title: string) => {
        const trimmed = title.trim();
        const existing = get().customGames.find(
          (g) => g.title.toLowerCase() === trimmed.toLowerCase(),
        );
        if (existing) return existing;

        const id = `custom-${slugifyTitle(trimmed)}-${Date.now().toString(36)}`;
        const game: Game = {
          id,
          slug: id,
          title: trimmed,
          genres: [],
          tags: [],
          description:
            "Added by you — not in the curated catalog yet, but fully rateable and recommendable.",
          cover: "",
          backdrop: "",
          stores: {},
          communityRating: 0,
          ratingCount: 0,
          isCustom: true,
        };
        set((state) => ({ customGames: [...state.customGames, game] }));
        return game;
      },
    }),
    { name: "retro-custom-games", version: 1 },
  ),
);
