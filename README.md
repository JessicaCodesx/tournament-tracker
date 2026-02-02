# CoD Tournament Tracker

A lightweight web app for running custom Call of Duty: Black Ops 7 tournaments with friends. Generate balanced team matchups, assign CDL maps/modes at random, track stats, and share a code so everyone can watch the leaderboard update live.

## Features

- **Tournament setup** — Enter 6 players, choose 3v3 or 2v2v2
- **Shareable codes** — Unique 6-character code; friends open `/watch/CODE` to view live
- **Random map/mode** — Each match gets a random CDL map and mode
- **Quick stat entry** — Kills, deaths, score per player after each match
- **Live leaderboard** — Real-time standings for host and spectators
- **Tournament summary** — Champion, final standings, and MVP-style stats

## Tech stack

- React 19 + Vite 7
- TypeScript
- Tailwind CSS 4
- Firebase Realtime Database
- React Router 7

## Setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd tournament-tracker
   npm install
   ```

2. **Firebase**

   - Create a [Firebase](https://console.firebase.google.com/) project and enable Realtime Database.
   - Copy `.env.example` to `.env` and fill in your Firebase config (all `VITE_FIREBASE_*` values from the Firebase console).

3. **Run**

   ```bash
   npm run dev
   ```

   Open the URL shown (e.g. http://localhost:5173).

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build (tests `dist/` with base path)
- `npm run deploy` — Build and push `dist/` to the `gh-pages` branch (GitHub Pages)

## Mobile

The app is built mobile-first: touch targets are at least 44px, inputs use 16px font to avoid iOS zoom, and layout stacks on small screens. Safe-area insets are respected for notched devices. Use it on phones while the TV runs the game.

## Deploy to GitHub Pages

1. **Set the base path** (if needed): Local dev uses `base: '/'`. For production, `vite.config.ts` defaults to `base: '/tournament-tracker/'`. To override:
   - **Project site** (`username.github.io/tournament-tracker`): default `base: '/tournament-tracker/'` is correct.
   - **User site** (`username.github.io`): set `base: '/'` (or `VITE_BASE_PATH=/` when building).
   - **Other repo name**: set `base: '/your-repo-name/'` or `VITE_BASE_PATH=/your-repo-name/`.

2. **Build and deploy**:
   ```bash
   npm run build
   npm run deploy
   ```
   Or use GitHub Actions to build and deploy on push (see [docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publish-source-for-github-pages#publishing-with-a-custom-github-actions-workflow)).

3. **GitHub repo settings**: In the repo → Settings → Pages → Source, choose **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**.

4. **Share links**: Your app will be at `https://<username>.github.io/<repo-name>/`. Share that URL and the watch path (e.g. `.../watch/CODE`) with friends.

## Project structure

- `src/components/` — Host, spectator, shared, and common UI components
- `src/context/` — Tournament state
- `src/hooks/` — Tournament actions and realtime subscription
- `src/pages/` — Home, Host, Watch, NotFound
- `src/services/` — Firebase CRUD and realtime listeners
- `src/utils/` — Team generation, map/mode selection, code generation, leaderboard, storage
- `src/data/` — CDL maps and modes
- `src/config/` — Firebase config

## License

MIT
