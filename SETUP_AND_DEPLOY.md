# CoD Tournament Tracker — Setup & Deploy

Step-by-step guide to run the app locally and deploy to GitHub Pages.

---

## First deployment (no GitHub repo yet)

Do this once to get your app live so you can test on your phone.

1. **Create a new repo on GitHub**
   - Go to [github.com/new](https://github.com/new).
   - **Repository name:** `tournament-tracker` (or any name — if different, you’ll set the base path in step 5).
   - Leave **Add a README** unchecked (you already have code).
   - Create the repo.

2. **Connect this folder to GitHub** (in PowerShell or Command Prompt, in the project folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tournament-tracker.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username (and `tournament-tracker` if you used a different repo name).

3. **Make sure `.env` exists**  
   The deploy build needs your Firebase config. If you haven’t already, copy `.env.example` to `.env` and fill in your Firebase values (see “Part 1” below).

4. **Build and deploy**
   ```bash
   npm run deploy
   ```
   The first time, Git may ask for your GitHub username and password. For password, use a **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens) if you have 2FA.

5. **If your repo name is not `tournament-tracker`**  
   Set the base path before deploying, then run `npm run deploy` again:
   ```bash
   set VITE_BASE_PATH=/your-repo-name/
   npm run deploy
   ```
   (On Mac/Linux: `export VITE_BASE_PATH=/your-repo-name/`.)

6. **Turn on GitHub Pages**
   - On GitHub, open your repo → **Settings** → **Pages**.
   - Under **Build and deployment**: Source = **Deploy from a branch**.
   - Branch: **gh-pages**, Folder: **/ (root)**. Save.

7. **Open on your phone**  
   After a minute or two, your site will be at:
   `https://YOUR_USERNAME.github.io/tournament-tracker/`  
   (Use your repo name if different.) Add it to your home screen for an app-like feel.

---

## Deploy from main (GitHub Actions)

To have the site **deploy automatically when you push to main** (no need to run `npm run deploy` locally):

1. **Add Firebase config as repo secrets**
   - On GitHub: repo → **Settings** → **Secrets and variables** → **Actions**.
   - Click **New repository secret** for each of these (use the same values as in your local `.env`):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_DATABASE_URL`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

2. **Switch Pages to GitHub Actions**
   - Repo → **Settings** → **Pages**.
   - Under **Build and deployment**, **Source**: choose **GitHub Actions** (not “Deploy from a branch”).

3. **Push to main**
   - Push your code (including the `.github/workflows/deploy-pages.yml` file) to `main`.
   - The workflow runs: it builds using the secrets and deploys to Pages. The site updates in a few minutes.

After this, every **push to main** triggers a new deploy. You can also run the workflow manually from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

---

## Prerequisites

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **Git** ([git-scm.com](https://git-scm.com))
- **Firebase** account (Google)
- **GitHub** account (for deployment)

---

## Part 1: Local setup

### 1. Get the code

If you already have the repo:

```bash
cd tournament-tracker
npm install
```

If you’re cloning from GitHub:

```bash
git clone https://github.com/YOUR_USERNAME/tournament-tracker.git
cd tournament-tracker
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name it (e.g. `cod-tournament-tracker`) and follow the prompts. You can turn off Google Analytics if you don’t need it.
4. When the project is ready, click **Continue** to open the project.

### 3. Enable Realtime Database

1. In the left sidebar, click **Build** → **Realtime Database**.
2. Click **Create Database**.
3. Pick a location (e.g. `us-central1`).
4. Start in **test mode** for now (you can lock it down with rules later).
5. Click **Enable**. You’ll see an empty database with a URL like `https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com`.

### 4. Get your Firebase config

1. In the left sidebar, click the **gear** next to “Project Overview” → **Project settings**.
2. Scroll to **Your apps**.
3. Click the **Web** icon (`</>`).
4. Register an app nickname (e.g. “Tournament Tracker”) and leave “Firebase Hosting” unchecked. Click **Register app**.
5. You’ll see a config object. Copy the values into your `.env` as below (you don’t need the `measurementId` for this app).

### 5. Create your `.env` file

In the project root (same folder as `package.json`), create a file named `.env` (no extension).

Copy the contents of `.env.example` into `.env`, then fill in the values from the Firebase config:

```env
# Firebase Realtime Database (from Firebase Console)
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

- **API Key** → `VITE_FIREBASE_API_KEY`
- **Auth Domain** → `VITE_FIREBASE_AUTH_DOMAIN`
- **Database URL** → `VITE_FIREBASE_DATABASE_URL` (from Realtime Database tab, not from the snippet — it looks like `https://....-default-rtdb.firebaseio.com`)
- **Project ID** → `VITE_FIREBASE_PROJECT_ID`
- **Storage Bucket** → `VITE_FIREBASE_STORAGE_BUCKET`
- **Messaging Sender ID** → `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **App ID** → `VITE_FIREBASE_APP_ID`

Save the file. **Do not commit `.env`** — it’s in `.gitignore`.

### 6. Run the app locally

```bash
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). You should see the home page. Create a tournament, enter 6 players, and confirm you get a shareable code and can enter stats. If that works, Firebase is set up correctly.

---

## Part 2: Deploy to GitHub Pages

### 1. Push your code to GitHub (if you haven’t already)

```bash
git remote add origin https://github.com/YOUR_USERNAME/tournament-tracker.git
git branch -M main
git push -u origin main
```

(Use your actual repo URL and branch name if different.)

### 2. Set the base path (if your repo name isn’t `tournament-tracker`)

The app is built to be served at `https://USERNAME.github.io/REPO_NAME/`.

- If your repo is named **`tournament-tracker`**: you don’t need to change anything.
- If your repo has a **different name** (e.g. `cod-tracker`): set the base path when building:

  **Option A — Edit `vite.config.ts`:**  
  Change the default base from `'/tournament-tracker/'` to `'/your-repo-name/'`.

  **Option B — Use an env var when building:**  
  ```bash
  set VITE_BASE_PATH=/your-repo-name/
  npm run build
  npm run deploy
  ```
  (On Mac/Linux use `export VITE_BASE_PATH=/your-repo-name/`.)

- If you’re using a **user/org site** at `https://USERNAME.github.io/` (no repo name in the URL): set base to `'/'` in `vite.config.ts` or `VITE_BASE_PATH=/` when building.

### 3. Build and deploy

From the project root, with `.env` in place (so the build can use your Firebase config):

```bash
npm run build
npm run deploy
```

`npm run deploy` runs the build and then pushes the `dist/` folder to the `gh-pages` branch. The first time you run it, it may ask for your GitHub credentials.

### 4. Turn on GitHub Pages

1. On GitHub, open your repo.
2. Go to **Settings** → **Pages** (under “Code and automation”).
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch.
   - **Branch**: `gh-pages` (or whatever branch the `gh-pages` package pushed to).
   - **Folder**: `/ (root)`.
4. Click **Save**.

After a minute or two, your site will be live at:

- **Project site:** `https://YOUR_USERNAME.github.io/tournament-tracker/`
- (Or whatever repo name and base path you used.)

Share that URL with friends. To watch a tournament they use:  
`https://YOUR_USERNAME.github.io/tournament-tracker/watch/CODE`

### 5. Optional: preview the production build locally

To test the built app with the same base path as GitHub Pages:

```bash
npm run build
npm run preview
```

Open the URL shown (e.g. `http://localhost:4173/tournament-tracker/`). Links and routes should behave like on GitHub Pages.

---

## Quick reference

| Step              | Command / action |
|-------------------|------------------|
| Install deps      | `npm install`    |
| Run locally       | `npm run dev`    |
| Build             | `npm run build`  |
| Deploy to Pages   | `npm run deploy` |
| Preview build     | `npm run preview`|

| Firebase          | Where to get it |
|-------------------|------------------|
| Config values     | Project settings → Your apps → Web app config |
| Database URL      | Realtime Database tab → URL at top |

| GitHub Pages      | Where to set it |
|-------------------|------------------|
| Publish source    | Repo → Settings → Pages → Branch: `gh-pages`, Folder: `/ (root)` |

---

## Troubleshooting

- **Blank page after deploy**  
  - Check that the base path in `vite.config.ts` (or `VITE_BASE_PATH`) matches your repo name and has a leading and trailing slash, e.g. `/tournament-tracker/`.
  - Open the browser console (F12) and look for 404s on JS/CSS — that usually means the base path is wrong.

- **Firebase permission denied / read write failed**  
  - In Firebase Console → Realtime Database → **Rules**, if you’re not using authenticated users, you can temporarily use test mode:
    ```json
    {
      "rules": {
        ".read": true,
        ".write": true
      }
    }
    ```
  - For production, restrict read/write (e.g. by path or auth) and deploy rules.

- **Deploy fails with “Permission denied” or “Authentication failed”**  
  - Make sure you’re logged into GitHub (`git` and/or GitHub CLI).
  - If you use 2FA, use a **Personal Access Token** as the password when `gh-pages` (or Git) prompts you.
  - You can also use GitHub Actions to build and deploy so secrets stay in the repo and you don’t deploy from your machine.

If you want, we can add a GitHub Actions workflow next so every push to `main` builds and deploys automatically.
