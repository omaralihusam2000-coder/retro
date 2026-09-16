export interface UpcomingGame {
  id: string;
  title: string;
  developer: string;
  publisher: string;
  expectedRelease: string;
  dateConfirmed: boolean;
  platforms: string[];
  genres: string[];
  description: string;
}

export const upcomingGames: UpcomingGame[] = [
  {
    id: "gta6",
    title: "Grand Theft Auto VI",
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    expectedRelease: "November 19, 2026",
    dateConfirmed: true,
    platforms: ["PS5", "Xbox Series X/S"],
    genres: ["Open World", "Action", "Crime"],
    description:
      "Rockstar's return to Vice City, following two protagonists across a modern, Florida-inspired open world. No PC release has been announced yet.",
  },
  {
    id: "silksong",
    title: "Hollow Knight: Silksong",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    expectedRelease: "TBA",
    dateConfirmed: false,
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    genres: ["Metroidvania", "Action", "Indie"],
    description:
      "The long-awaited follow-up to Hollow Knight, starring Hornet on a new journey through the kingdom of Pharloom. No firm date yet after years in development.",
  },
  {
    id: "eldertscrolls6",
    title: "The Elder Scrolls VI",
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    expectedRelease: "TBA",
    dateConfirmed: false,
    platforms: ["PC", "Xbox Series X/S"],
    genres: ["RPG", "Open World", "Fantasy"],
    description:
      "Confirmed in development since 2018. Bethesda has repeatedly said it's still years away — no release window has been announced.",
  },
  {
    id: "fable",
    title: "Fable",
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    expectedRelease: "TBA",
    dateConfirmed: false,
    platforms: ["PC", "Xbox Series X/S"],
    genres: ["RPG", "Fantasy", "Open World"],
    description:
      "A ground-up reboot of the beloved British fantasy RPG series, from the studio behind the Forza Horizon games.",
  },
  {
    id: "judas",
    title: "Judas",
    developer: "Ghost Story Games",
    publisher: "Ghost Story Games",
    expectedRelease: "TBA",
    dateConfirmed: false,
    platforms: ["PC", "PS5", "Xbox Series X/S"],
    genres: ["Shooter", "Narrative", "Sci-Fi"],
    description:
      "Ken Levine's spiritual successor to BioShock — a narrative-driven shooter aboard a fractured, cult-like starship with characters who react to how you treat them.",
  },
  {
    id: "marvel1943",
    title: "Marvel 1943: Rise of Hydra",
    developer: "Skydance Games",
    publisher: "Skydance Games",
    expectedRelease: "TBA",
    dateConfirmed: false,
    platforms: ["PC", "PS5", "Xbox Series X/S"],
    genres: ["Action", "Adventure"],
    description:
      "A World War II-era adventure starring Captain America and Black Panther in Nazi-occupied Paris, co-written by veteran writer Amy Hennig.",
  },
  {
    id: "metroidprime4",
    title: "Metroid Prime 4: Beyond",
    developer: "Retro Studios",
    publisher: "Nintendo",
    expectedRelease: "TBA",
    dateConfirmed: false,
    platforms: ["Nintendo Switch", "Nintendo Switch 2"],
    genres: ["Shooter", "Adventure", "Sci-Fi"],
    description:
      "Samus returns in the long-in-development follow-up to the acclaimed Metroid Prime trilogy.",
  },
];
