# Mars Rover Photo Gallery — Team rover

Browse and search photographs captured by NASA's Mars rovers (Curiosity and Perseverance), powered by NASA's public image library.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [How the NASA Integration Works](#how-the-nasa-integration-works)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

You need **one** of the following package managers installed locally:

| Tool | Required version | Notes |
| --- | --- | --- |
| **Bun** | `1.3.14` or newer | Used as the default package manager (see `packageManager` in `package.json`). |
| **Node.js** (npm) | `20.x` or newer | Works as a fallback if you prefer npm. |
| **pnpm** | `9.x` or newer | Optional alternative. |
| **Yarn** | `1.22.x` or newer | Optional alternative. |

> **Tip:** The `package.json` pins `bun@1.3.14`. If you use Bun, run `bun --version` to confirm. To install or upgrade Bun:
> ```bash
> curl -fsSL https://bun.sh/install | bash
> ```

No NASA API key is strictly required to run the app — it relies on NASA's public **Images and Video Library API** (`images-api.nasa.gov`), which is free and unauthenticated. An optional `NASA_API_KEY` is described below for the legacy manifest module.

---

## Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repo-url>
   cd mars-rover-photo-gallery-team-rover-
   ```

2. **Install dependencies** using your preferred package manager:

   ```bash
   # Recommended (matches packageManager field)
   bun install

   # Alternatives
   npm install
   pnpm install
   yarn install
   ```

   > **Note on native modules:** This project depends on `sharp` (image optimization) and `unrs-resolver`. They are listed under `trustedDependencies`/`ignoreScripts` in `package.json`. With Bun, trusted deps are built automatically. If you use npm and see errors about missing native binaries, run:
   > ```bash
   > npm rebuild sharp
   > ```

---

## Environment Variables

The app runs without any environment configuration. Optionally, you can create a `.env` file in the project root to supply a NASA API key for the legacy manifest module (`lib/nasa.ts`):

```bash
# .env
NASA_API_KEY=your_nasa_api_key_here
```

- The key falls back to `"DEMO_KEY"` if the variable is not set.
- `DEMO_KEY` is NASA's public demo key and works for light usage.
- Get a free key at <https://api.nasa.gov> (no key needed for the primary image-search features used by the app).

> **Security:** `.env*` is already listed in `.gitignore`, so your key will not be committed. Never commit real credentials.

---

## Available Scripts

Defined in `package.json`:

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `next dev` | Start the dev server with hot reload at `http://localhost:3000`. |
| `build` | `next build` | Create an optimized production build. |
| `start` | `next start` | Run the production server (run `build` first). |
| `lint` | `eslint` | Lint the codebase with ESLint. |

---

## Running the App

Start the development server:

```bash
bun run dev
# or
npm run dev
```

Open <http://localhost:3000> in your browser.

You can begin editing the UI by modifying `app/page.tsx`. The page auto-updates as you save.

To run a production build:

```bash
bun run build
bun run start
```

---

## Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── manifest/route.ts # Rover overview (count + recent images)
│   │   └── search/route.ts   # Image search endpoint
│   ├── image/[nasaId]/page.tsx # Single-image detail page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (rover gallery + search)
│   └── globals.css           # Global styles (Tailwind)
├── components/               # UI components
│   ├── ImageGrid.tsx
│   ├── RoverSelector.tsx
│   ├── SearchBar.tsx
│   ├── SearchTabs.tsx
│   └── SearchView.tsx
├── lib/                      # Data + types
│   ├── nasa.ts              # Legacy mars-photos manifest (unused by UI)
│   ├── nasa-images.ts       # Active NASA Images API client
│   └── types.ts             # Shared TypeScript types
├── public/                   # Static assets
├── next.config.ts            # Next.js config (remote image host allowlist)
├── postcss.config.mjs        # Tailwind/PostCSS setup
├── tsconfig.json             # TypeScript config (@/* path alias)
└── package.json
```

---

## API Routes

Both routes are Route Handlers under `app/api`. They proxy NASA's API and reshape the response for the frontend.

### `GET /api/manifest?rover=<rover>`

Returns an overview for a rover.

- **Query params:** `rover` — `curiosity` (default) or `perseverance`.
- **Response:**
  ```json
  {
    "rover": "curiosity",
    "totalImages": 12345,
    "items": [
      {
        "nasa_id": "...",
        "title": "...",
        "date_created": "...",
        "center": "...",
        "thumbnail": "https://..."
      }
    ]
  }
  ```
- **Errors:** `400` for unknown rover; `502` if NASA is unreachable.

### `GET /api/search?rover=<rover>&q=<query>&...`

Searches NASA images, scoped to the selected rover.

- **Query params:** `rover`, `q` (user query), `media_type`, `year_start`, `year_end`, `center`, `page` (default `1`), `page_size` (default `20`).
- **Response:** `{ items, totalHits, currentPage, pageSize, nextPage }`.
- **Errors:** `502` if NASA is unreachable.

---

## How the NASA Integration Works

The user-facing features use **NASA's Images and Video Library API** (`https://images-api.nasa.gov`), which is free and requires no authentication.

- `lib/nasa-images.ts` builds search/asset/metadata URLs and calls:
  - `GET /search` — list images matching a query (used for both the rover overview and search).
  - `GET /asset/{nasa_id}` — available size URLs for a single image.
  - `GET /metadata/{nasa_id}` — image metadata.
- The legacy Mars Photos `manifests` API (`api.nasa.gov/mars-photos`, used in `lib/nasa.ts`) was **archived by NASA**, so the app derives rover stats (total image count + recent images) from image search instead. `lib/nasa.ts` is kept for reference but is not used by the running app.
- Responses from NASA are cached with `next: { revalidate: 3600 }` (1-hour ISR) and route-level `revalidate = 3600` to reduce external calls.
- Remote images are served from `images-assets.nasa.gov`, which is allow-listed in `next.config.ts` under `images.remotePatterns`.

---

## Deployment

### Deploy on Vercel (recommended)

The easiest path is [Vercel](https://vercel.com), the platform built by the creators of Next.js.

1. Push the repo to GitHub.
2. Go to <https://vercel.com/new>.
3. Import the repository.
4. Vercel auto-detects Next.js — no build configuration needed.
5. (Optional) Add `NASA_API_KEY` under **Environment Variables** if you want the legacy module to use a specific key.
6. Click **Deploy**. Your app will be live at a `*.vercel.app` URL.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Other platforms

Because this is a standard Next.js app, you can deploy anywhere that supports Node.js:

```bash
bun run build
bun run start
```

- **Node server / Docker:** Build, then run `next start` behind a reverse proxy (Nginx, Caddy) or in a container.
- **Static export** is not used here (the app relies on server route handlers and image optimization), so a Node runtime is required at runtime.

Minimal `Dockerfile` example:

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Error: Cannot find module` / native binary error | `sharp` not built | Run `npm rebuild sharp` (or use Bun, which builds trusted deps automatically). |
| Page shows "Could not load rover information." | NASA API unreachable or rate-limited | Check your network; the app uses a 1-hour cache, so a transient outage recovers automatically. |
| Images don't load | Remote image host not allow-listed | Confirm `images-assets.nasa.gov` is in `next.config.ts` `remotePatterns`. |
| `bun: command not found` | Bun not installed | Install Bun (see Prerequisites) or use `npm install` / `npm run dev`. |
| Port 3000 already in use | Another process on 3000 | Run `bun run dev -- -p 3001` to use a different port. |

### Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [NASA Images and Video Library API](https://images.nasa.gov/docs)
- [NASA API portal](https://api.nasa.gov) (for API keys)

---

## License

This project is for educational/team use.
