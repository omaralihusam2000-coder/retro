import { create } from "zustand";
import type { Game } from "./types";
import { loadExtendedCatalog } from "./catalogApi";

type CatalogStatus = "idle" | "loading" | "loaded" | "error";

interface CatalogState {
  liveGames: Game[];
  status: CatalogStatus;
  load: () => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  liveGames: [],
  status: "idle",

  load: () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    loadExtendedCatalog()
      .then((liveGames) => set({ liveGames, status: "loaded" }))
      .catch(() => set({ status: "error" }));
  },
}));
