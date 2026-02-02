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
- `npm run preview` — Preview production build

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
