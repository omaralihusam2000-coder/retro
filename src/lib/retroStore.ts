import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RetroState {
  scanlinesOn: boolean;
  toggleScanlines: () => void;
}

export const useRetroStore = create<RetroState>()(
  persist(
    (set) => ({
      scanlinesOn: true,
      toggleScanlines: () => set((state) => ({ scanlinesOn: !state.scanlinesOn })),
    }),
    { name: "retro-crt-mode", version: 1 },
  ),
);
