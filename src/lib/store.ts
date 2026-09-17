import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameList, LogStatus, UserLogEntry } from "./types";

interface UserState {
  displayName: string;
  handle: string;
  bio: string;
  joinedAt: string;
  logs: Record<string, UserLogEntry>;
  lists: GameList[];
  favorites: string[];
  recentlyViewed: string[];
  interestedUpcoming: string[];
  setDisplayName: (name: string) => void;
  setHandle: (handle: string) => void;
  setBio: (bio: string) => void;
  toggleFavorite: (gameId: string) => void;
  addRecentlyViewed: (gameId: string) => void;
  toggleInterestedUpcoming: (id: string) => void;
  setStatus: (gameId: string, status: LogStatus | undefined) => void;
  setRating: (gameId: string, rating: number | undefined) => void;
  setReview: (gameId: string, review: string) => void;
  setRecommend: (gameId: string, recommend: boolean | undefined) => void;
  clearLog: (gameId: string) => void;
  createList: (name: string, description: string) => string;
  deleteList: (listId: string) => void;
  addToList: (listId: string, gameId: string) => void;
  removeFromList: (listId: string, gameId: string) => void;
}

function ensureEntry(logs: Record<string, UserLogEntry>, gameId: string): UserLogEntry {
  return (
    logs[gameId] ?? {
      gameId,
      loggedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      displayName: "You",
      handle: "you",
      bio: "Player and collector, tracking my library one game at a time.",
      joinedAt: new Date().toISOString(),
      logs: {},
      lists: [],
      favorites: [],
      recentlyViewed: [],
      interestedUpcoming: [],

      setDisplayName: (name) => set({ displayName: name }),
      setHandle: (handle) => set({ handle }),
      setBio: (bio) => set({ bio }),

      toggleFavorite: (gameId) =>
        set((state) => ({
          favorites: state.favorites.includes(gameId)
            ? state.favorites.filter((id) => id !== gameId)
            : [...state.favorites, gameId],
        })),

      addRecentlyViewed: (gameId) =>
        set((state) => ({
          recentlyViewed: [gameId, ...state.recentlyViewed.filter((id) => id !== gameId)].slice(
            0,
            12,
          ),
        })),

      toggleInterestedUpcoming: (id) =>
        set((state) => ({
          interestedUpcoming: state.interestedUpcoming.includes(id)
            ? state.interestedUpcoming.filter((x) => x !== id)
            : [...state.interestedUpcoming, id],
        })),

      setStatus: (gameId, status) =>
        set((state) => {
          const current = ensureEntry(state.logs, gameId);
          const next = { ...current, status, updatedAt: new Date().toISOString() };
          const cleared = !status && !current.rating && !current.review;
          const logs = { ...state.logs };
          if (cleared) {
            delete logs[gameId];
          } else {
            logs[gameId] = next;
          }
          return { logs };
        }),

      setRating: (gameId, rating) =>
        set((state) => {
          const current = ensureEntry(state.logs, gameId);
          const next: UserLogEntry = {
            ...current,
            rating,
            status: current.status ?? (rating ? "completed" : current.status),
            updatedAt: new Date().toISOString(),
          };
          return { logs: { ...state.logs, [gameId]: next } };
        }),

      setReview: (gameId, review) =>
        set((state) => {
          const current = ensureEntry(state.logs, gameId);
          const next: UserLogEntry = { ...current, review, updatedAt: new Date().toISOString() };
          return { logs: { ...state.logs, [gameId]: next } };
        }),

      setRecommend: (gameId, recommend) =>
        set((state) => {
          const current = ensureEntry(state.logs, gameId);
          const next: UserLogEntry = { ...current, recommend, updatedAt: new Date().toISOString() };
          return { logs: { ...state.logs, [gameId]: next } };
        }),

      clearLog: (gameId) =>
        set((state) => {
          const logs = { ...state.logs };
          delete logs[gameId];
          return { logs };
        }),

      createList: (name, description) => {
        const id = `list-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          lists: [
            ...state.lists,
            { id, name, description, gameIds: [], createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },

      deleteList: (listId) =>
        set((state) => ({ lists: state.lists.filter((l) => l.id !== listId) })),

      addToList: (listId, gameId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId && !l.gameIds.includes(gameId)
              ? { ...l, gameIds: [...l.gameIds, gameId] }
              : l,
          ),
        })),

      removeFromList: (listId, gameId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, gameIds: l.gameIds.filter((id) => id !== gameId) } : l,
          ),
        })),
    }),
    { name: "retro-user-state", version: 1 },
  ),
);
