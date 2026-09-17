/**
 * Historical platform + legacy-impact notes for a curated set of genuine
 * retro classics already in the catalog. Kept as a small overlay (rather
 * than fields on every one of the 314 catalog entries) so nothing here is
 * guessed — every platform and fact below is one we're confident about.
 * Games not listed here default to platforms: ["PC"], which is accurate
 * for the rest of the catalog since it's all Steam/Epic/GOG storefront data.
 */
export interface RetroMeta {
  platforms: string[];
  legacy: string;
}

export const retroMeta: Record<string, RetroMeta> = {
  doom1993: {
    platforms: ["MS-DOS", "PC", "SNES", "Sega 32X", "PlayStation", "Sega Saturn", "Game Boy Advance"],
    legacy:
      "The 1993 id Software shooter that popularized the first-person shooter genre and PC LAN deathmatch culture. Its shareware-first distribution reshaped how PC games spread, and its engine tech was licensed out for years by other studios.",
  },
  halflife: {
    platforms: ["PC", "PlayStation 2"],
    legacy:
      "Valve's debut reinvented the FPS as one uninterrupted scripted narrative instead of a level-select shooter. Its SDK-driven modding scene produced Counter-Strike and Team Fortress — arguably more influential than the base game.",
  },
  fallout1: {
    platforms: ["MS-DOS", "PC"],
    legacy:
      "Interplay's turn-based post-apocalyptic RPG set the tone — dark humor, real moral consequence, the SPECIAL system — that the whole Fallout series, including Bethesda's later open-world entries, still builds on.",
  },
  fallout2: {
    platforms: ["MS-DOS", "PC"],
    legacy:
      "Expanded the original's world and systems within a year of release, and is still cited by RPG fans as the high point of the classic, top-down Fallout formula before the series went 3D.",
  },
  bgee: {
    platforms: ["PC", "macOS", "iOS", "Android", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    legacy:
      "The original 1998 Baldur's Gate revived Dungeons & Dragons CRPGs on PC via the Infinity Engine, proving there was still a big audience for party-based, real-time-with-pause RPGs — paving the way for Baldur's Gate II and, decades later, Baldur's Gate 3.",
  },
  systemshock2: {
    platforms: ["PC"],
    legacy:
      "A commercial flop on release in 1999 that became one of the most influential horror games ever made — its audio-log storytelling and RPG-lite survival-horror mix directly inspired BioShock, built by several of the same developers.",
  },
  grimfandango: {
    platforms: ["PC", "macOS", "Linux", "PlayStation 4", "PS Vita"],
    legacy:
      "LucasArts' 1998 film-noir adventure set in the Land of the Dead is routinely ranked among the best adventure games ever made; its 2015 remaster introduced Tim Schafer's writing to a generation that missed the point-and-click era.",
  },
  planescapetorment: {
    platforms: ["PC", "macOS", "Linux", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    legacy:
      "Built on the same Infinity Engine as Baldur's Gate but turned the CRPG script toward story and dialogue over combat in 1999 — still the game most cited when people argue video game writing can stand next to literature.",
  },
};
