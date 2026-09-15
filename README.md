# Retro

Retro is a social diary for gamers — think Letterboxd, but for video games —
combined with a live deal tracker across Steam, Epic Games and GOG.

## Features

- **Log, rate & review** — 5-star ratings (half-star precision), written
  reviews, and a backlog/playing/completed/wishlist/abandoned status for
  every game.
- **Diary & profile** — a running log of everything you've rated or reviewed,
  stats (average rating, favorite genre, completion counts), and a
  Letterboxd-style rated-games grid.
- **Lists** — build and manage custom lists of games.
- **Activity feed** — a sample community feed of logs, ratings and reviews.
- **Live deals** — pulls real-time discounts from a public cross-store deal
  index (CheapShark) filtered to Steam, Epic Games Store and GOG, with every
  card linking straight out to the real storefront to buy. Falls back to a
  curated sample data set (still using real store links) if the live feed is
  unreachable, and the UI always says which one you're looking at.
- **Catalog** — a curated set of ~28 well-known games with accurate store
  links, searchable and filterable by genre.

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, React Router, Zustand
(persisted to `localStorage`), Framer Motion, lucide-react.

There's no backend: your ratings, reviews, statuses and lists are stored
locally in your browser via `localStorage`. The activity feed and game
reviews (other than your own) are sample data illustrating what a live
community feed would look like.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```
