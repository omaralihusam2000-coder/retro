# Supabase setup

The app works fine with zero setup — community suggestions, upvotes,
comments and "Played It!" badges just stay local to each visitor's browser
(via `localStorage`). To make them shared across everyone who visits the
site, wire up a free Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the project dashboard, paste in `schema.sql` from
   this folder, and run it.
3. Open **Project Settings -> API** and copy the **Project URL** and the
   **anon public** key.
4. Locally: copy `.env.example` (repo root) to `.env.local` and fill in both
   values, then restart `npm run dev`.
5. For the deployed GitHub Pages site: add the same two values as repository
   secrets (**Settings -> Secrets and variables -> Actions**) named
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The deploy workflow
   already reads them — the next push rebuilds with Supabase wired in.

Until those secrets exist, the deployed site keeps working exactly as it
does today, just with per-browser storage instead of shared storage.
