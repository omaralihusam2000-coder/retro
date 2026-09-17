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

## Search providers

The Suggest page's title search tries, in order, IGDB, RAWG, Wikipedia,
then CheapShark (see `src/lib/gameSearchApi.ts`) — the first one configured
and returning results wins. None are required; without any of them, search
falls back to Wikipedia (needs no setup) and ultimately plain manual entry.

**RAWG** — free API key, no card needed: sign up at
[rawg.io/apidocs](https://rawg.io/apidocs), then set `VITE_RAWG_API_KEY`
(locally in `.env.local`, or as a repo secret of the same name for the
deployed build).

**IGDB** — the best-curated option, but gated behind Twitch OAuth:

1. Create a Twitch account (or use an existing one) and enable two-factor
   authentication — Twitch's developer console requires it.
2. Go to [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) ->
   **Register Your Application**. Pick any unique name, any category, and
   put `https://localhost` as the OAuth Redirect URL (required by the form,
   unused by this integration).
3. Open the app you just created, copy the **Client ID**, then click
   **New Secret** to generate a **Client Secret**.
4. Visit [api.igdb.com](https://api.igdb.com/) once and sign in with that
   same Twitch account — this activates IGDB API access for it.
5. Add `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET` as **repository secrets**
   (Settings -> Secrets and variables -> Actions -> New repository secret).
   Note: no `VITE_` prefix on these two — they stay server-side.

The deploy workflow exchanges those two secrets for a short-lived OAuth
access token *during the GitHub Actions run* and only bakes the Client ID
and that access token into the built site as `VITE_IGDB_CLIENT_ID` /
`VITE_IGDB_ACCESS_TOKEN` — the actual Twitch client secret never reaches
the browser. The token is refreshed automatically on every deploy; if the
site goes more than ~60 days without a deploy the embedded token can go
stale until the next push, at which point search just quietly falls back
to RAWG/Wikipedia/CheapShark in the meantime.

For local dev, generate a token yourself once (see `.env.example` for the
exact `curl` command) and put it in `.env.local` — it'll need regenerating
every couple of months.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```
