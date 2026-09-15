import { games } from "./gamesData";
import type { UserLogEntry } from "./types";

export interface UserStats {
  totalLogged: number;
  completed: number;
  playing: number;
  backlog: number;
  wishlist: number;
  reviewsWritten: number;
  averageRating: number | null;
  favoriteGenre: string | null;
}

export function computeStats(logs: Record<string, UserLogEntry>): UserStats {
  const entries = Object.values(logs);
  const rated = entries.filter((e) => typeof e.rating === "number");
  const genreCounts = new Map<string, number>();

  for (const entry of entries) {
    const game = games.find((g) => g.id === entry.gameId);
    if (!game) continue;
    for (const genre of game.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }

  let favoriteGenre: string | null = null;
  let max = 0;
  for (const [genre, count] of genreCounts) {
    if (count > max) {
      max = count;
      favoriteGenre = genre;
    }
  }

  return {
    totalLogged: entries.length,
    completed: entries.filter((e) => e.status === "completed").length,
    playing: entries.filter((e) => e.status === "playing").length,
    backlog: entries.filter((e) => e.status === "backlog").length,
    wishlist: entries.filter((e) => e.status === "wishlist").length,
    reviewsWritten: entries.filter((e) => e.review && e.review.trim().length > 0).length,
    averageRating: rated.length
      ? Math.round((rated.reduce((sum, e) => sum + (e.rating ?? 0), 0) / rated.length) * 10) / 10
      : null,
    favoriteGenre,
  };
}
