export type StoreKey = "steam" | "epic" | "gog";

export interface StoreLink {
  url: string;
  price?: number;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  year: number;
  developer: string;
  publisher: string;
  genres: string[];
  tags: string[];
  description: string;
  cover: string;
  backdrop: string;
  stores: Partial<Record<StoreKey, StoreLink>>;
  communityRating: number;
  ratingCount: number;
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
