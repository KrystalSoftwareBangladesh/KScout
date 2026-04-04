# KScout

KScout is a Vue 3 single-page application for grid-based business discovery. Phase 1 focuses on place finding: create a session, geocode a territory through the backend, generate search cells, collect Google Places results, inspect raw payloads, and export the saved businesses. The UI is already structured so Phase 2 client-finding workflows can be added without reorganizing the app shell.

## Stack

- Vue 3
- Vite 5
- Pinia 2
- Vue Router 4 with hash routing
- Native `fetch` wrapped in `useApi`
- Scoped component CSS with global design tokens

## Run

```sh
pnpm install
pnpm dev
```

Additional environment-aware dev commands:

```sh
pnpm dev:stage
pnpm dev:prod
```

The frontend now supports three Vite modes:

- `development` via `.env.development`
- `stage` via `.env.stage`
- `production` via `.env.production`

`VITE_API_BASE_URL` controls the frontend request base URL, and `VITE_API_PROXY_TARGET` controls the Vite dev-server proxy target for `/api/*`.

## Build

```sh
pnpm build
```

Explicit mode builds are also available:

```sh
pnpm build:dev
pnpm build:stage
pnpm build:prod
```

`pnpm start:prod` previews the production build on port `4173`.

## Views

- `/#/` Dashboard
- `/#/search` Find Places
- `/#/results` Results table
- `/#/grid` Grid View
- `/#/raw` Raw Data
- `/#/setup` Setup
- `/#/client-finder` Phase 2 placeholder

## Notes

- The app uses a dark intelligence-tool design system with custom tokens in [src/assets/global.css](/home/rkshaon/Desktop/personal/KScout/src/assets/global.css).
- Session, place, and toast state are organized by domain in [src/stores/sessions.ts](/home/rkshaon/Desktop/personal/KScout/src/stores/sessions.ts), [src/stores/places.ts](/home/rkshaon/Desktop/personal/KScout/src/stores/places.ts), and [src/stores/toast.ts](/home/rkshaon/Desktop/personal/KScout/src/stores/toast.ts).
