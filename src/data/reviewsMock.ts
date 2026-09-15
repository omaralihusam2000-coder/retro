export interface MockReview {
  id: string;
  gameId: string;
  username: string;
  rating: number;
  text: string;
  timestamp: string;
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 3600 * 1000).toISOString();
}

export const reviewsMock: MockReview[] = [
  { id: "r1", gameId: "discoelysium", username: "nyx_underscore", rating: 5, text: "Finished my third playthrough and it still finds new ways to wreck me. The Thought Cabinet alone is better writing than most games manage in total.", timestamp: daysAgo(1) },
  { id: "r2", gameId: "discoelysium", username: "faelynn", rating: 4.5, text: "Slow first two hours, then it never lets go. The skill-check argument system is unlike anything else in the genre.", timestamp: daysAgo(9) },
  { id: "r3", gameId: "hollowknight", username: "pixel.pilgrim", rating: 4.5, text: "Map design this good should be studied. Got lost for the right reasons more than once.", timestamp: daysAgo(2) },
  { id: "r4", gameId: "bg3", username: "moss_and_mana", rating: 5, text: "Every companion feels hand-written for how I actually played. The amount of reactivity is genuinely absurd.", timestamp: daysAgo(4) },
  { id: "r5", gameId: "celeste", username: "8bit_oracle", rating: 4.5, text: "Chapter 9 humbled me for a full weekend. Worth every death.", timestamp: daysAgo(6) },
  { id: "r6", gameId: "control", username: "lowpoly_ghost", rating: 4, text: "The Ashtray Maze sequence alone justifies the whole runtime. Remedy doesn't miss on atmosphere.", timestamp: daysAgo(11) },
  { id: "r7", gameId: "hades", username: "driftwood_dev", rating: 5, text: "The only roguelike where I actually looked forward to dying, because it meant another conversation.", timestamp: daysAgo(15) },
  { id: "r8", gameId: "undertale", username: "rustbucket99", rating: 4.5, text: "Went in expecting a cute RPG, came out questioning every fight I've ever picked in a video game.", timestamp: daysAgo(22) },
  { id: "r9", gameId: "outerwilds", username: "quietcartridge", rating: 5, text: "Cannot talk about why it's good without ruining it. Just play it blind.", timestamp: daysAgo(30) },
  { id: "r10", gameId: "witcher3", username: "kestrel_ok", rating: 5, text: "Blood and Wine is one of the best expansions ever shipped, full stop.", timestamp: daysAgo(18) },
  { id: "r11", gameId: "eldenring", username: "verdant.vhs", rating: 4.5, text: "The Lands Between shouldn't work as an open world this well, but it does — every horizon hides something.", timestamp: daysAgo(8) },
  { id: "r12", gameId: "stardewvalley", username: "saveScumQueen", rating: 4.5, text: "Booted it up for 'twenty minutes' three years ago. Still not done with the community center.", timestamp: daysAgo(40) },
];

export function reviewsForGame(gameId: string): MockReview[] {
  return reviewsMock.filter((r) => r.gameId === gameId);
}
