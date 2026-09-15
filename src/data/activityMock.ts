import type { ActivityEntry } from "../lib/types";

const usernames = [
  "nyx_underscore",
  "pixel.pilgrim",
  "quietcartridge",
  "moss_and_mana",
  "8bit_oracle",
  "verdant.vhs",
  "kestrel_ok",
  "lowpoly_ghost",
  "saveScumQueen",
  "driftwood_dev",
  "faelynn",
  "rustbucket99",
];

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

const raw: Omit<ActivityEntry, "id" | "avatarSeed">[] = [
  { username: usernames[0], action: "reviewed", gameId: "discoelysium", rating: 5, reviewSnippet: "Finished my third playthrough and it still finds new ways to wreck me. The Thought Cabinet alone is better writing than most games manage in total.", timestamp: hoursAgo(1) },
  { username: usernames[1], action: "logged", gameId: "hollowknight", rating: 4.5, timestamp: hoursAgo(2) },
  { username: usernames[2], action: "listed", gameId: "outerwilds", listName: "Games that rewired my brain", timestamp: hoursAgo(3) },
  { username: usernames[3], action: "rated", gameId: "bg3", rating: 5, timestamp: hoursAgo(4) },
  { username: usernames[4], action: "reviewed", gameId: "celeste", rating: 4.5, reviewSnippet: "Chapter 9 humbled me for a full weekend. Worth every death — the way the game talks about anxiety without ever being preachy is rare.", timestamp: hoursAgo(6) },
  { username: usernames[5], action: "wishlisted", gameId: "balatro", timestamp: hoursAgo(7) },
  { username: usernames[6], action: "logged", gameId: "eldenring", rating: 5, timestamp: hoursAgo(9) },
  { username: usernames[7], action: "reviewed", gameId: "control", rating: 4, reviewSnippet: "The Ashtray Maze sequence alone justifies the whole runtime. Remedy doesn't miss on atmosphere.", timestamp: hoursAgo(11) },
  { username: usernames[8], action: "listed", gameId: "stardewvalley", listName: "Comfort games for bad weeks", timestamp: hoursAgo(13) },
  { username: usernames[9], action: "rated", gameId: "hades", rating: 5, timestamp: hoursAgo(15) },
  { username: usernames[10], action: "logged", gameId: "dos2", rating: 4.5, timestamp: hoursAgo(18) },
  { username: usernames[11], action: "reviewed", gameId: "undertale", rating: 4.5, reviewSnippet: "Went in expecting a cute RPG, came out questioning every fight I've ever picked in a video game.", timestamp: hoursAgo(22) },
  { username: usernames[0], action: "wishlisted", gameId: "ittakestwo", timestamp: hoursAgo(26) },
  { username: usernames[2], action: "rated", gameId: "vampiresurvivors", rating: 4, timestamp: hoursAgo(30) },
  { username: usernames[4], action: "logged", gameId: "deadcells", rating: 4.5, timestamp: hoursAgo(34) },
  { username: usernames[6], action: "listed", gameId: "witcher3", listName: "RPGs that respect your time (lol)", timestamp: hoursAgo(40) },
];

export const activityFeed: ActivityEntry[] = raw.map((entry, i) => ({
  ...entry,
  id: `act-${i}`,
  avatarSeed: entry.username,
}));

export function avatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 55) % 360;
  return `linear-gradient(135deg, hsl(${h1} 80% 55%), hsl(${h2} 85% 45%))`;
}

export function initials(username: string): string {
  return username.replace(/[._]/g, " ").trim().slice(0, 2).toUpperCase();
}
