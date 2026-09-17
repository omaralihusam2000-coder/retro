export type StoreKey = "steam" | "epic" | "gog";

export interface StoreLink {
  url: string;
  price?: number;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  /** Curated entries always have these; live-catalog entries may not. */
  year?: number;
  developer?: string;
  publisher?: string;
  genres: string[];
  tags: string[];
  description: string;
  cover: string;
  backdrop: string;
  stores: Partial<Record<StoreKey, StoreLink>>;
  communityRating: number;
  ratingCount: number;
  /** true for games hydrated from the live catalog rather than hand-curated */
  isExtended?: boolean;
  /** true for games a visitor typed in themselves — not curated or live-fetched */
  isCustom?: boolean;
  /** Original release platforms, e.g. "PC", "SNES", "Arcade", "Sega Genesis". */
  platforms?: string[];
  /** YouTube watch/embed URL for a trailer or gameplay walkthrough. */
  trailerUrl?: string;
  /** Screenshot image URLs for the in-page gallery. */
  screenshots?: string[];
  /** Short note on the game's lore/legacy impact, shown above the description. */
  legacy?: string;
}

export function eraForYear(year: number | undefined): string | undefined {
  if (!year) return undefined;
  if (year < 1990) return "80s";
  if (year < 2000) return "90s";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "2020s";
}

export type LogStatus = "backlog" | "playing" | "completed" | "wishlist" | "abandoned";

export interface UserLogEntry {
  gameId: string;
  status?: LogStatus;
  rating?: number;
  review?: string;
  recommend?: boolean;
  loggedAt: string;
  updatedAt: string;
}

export interface GameList {
  id: string;
  name: string;
  description: string;
  gameIds: string[];
  createdAt: string;
}

export interface LiveDeal {
  id: string;
  gameTitle: string;
  storeKey: StoreKey | "other";
  storeName: string;
  salePrice: number;
  normalPrice: number;
  savingsPct: number;
  thumb?: string;
  dealUrl: string;
  metacritic?: number;
  steamRatingText?: string;
}

export interface SuggestionInput {
  title: string;
  releaseYear?: number;
  platform: string;
  coverUrl?: string;
  videoUrl?: string;
  reason: string;
  submittedBy?: string;
}

export interface Suggestion extends SuggestionInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  votes: number;
}

export interface GameComment {
  id: string;
  gameId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  username: string;
  avatarSeed: string;
  action: "logged" | "reviewed" | "listed" | "rated" | "wishlisted";
  gameId: string;
  rating?: number;
  reviewSnippet?: string;
  listName?: string;
  timestamp: string;
}
