# AGENTS.md

Vite + React 19 single-page sneaker store ("MONO", Thai-language UI). Tailwind CSS v4 (CSS-first, no `tailwind.config`, theme via `src/index.css`).

## Commands

- `npm run dev` — Vite dev server on port 3000 (`--host=0.0.0.0`)
- `npm run lint` — the only verification step: `tsc --noEmit`. Run after edits. (No test framework.)
- `npm run build` — plain build (base `/`)
- `npm run db:init` / `npm run db:reset` — create (+`--reset`) `database/mono-shop.db` from `schema.sql` + seed data
- `npm run server` — Express + SQLite API on port 4000 (`tsx server.js`; Vite proxies `/api` → :4000)
- `npm run predeploy` / `npm run deploy` — GitHub Pages publish with `BASE_PATH=/shoesshop/`

Nothing is verified by CI except a successful build, so `npm run lint` is your safety net.

## Routing / deploy quirk

The app is served from GitHub Pages under the `/shoesshop/` subpath. `vite.config.ts` derives `base` from `BASE_PATH` (or `NODE_ENV=production`+`GITHUB_PAGES`), and the Router uses `basename={import.meta.env.BASE_URL}`. Do NOT hardcode `/` or remove `public/404.html` / the query-string redirect script in `index.html` — together they make deep links (e.g. `/shoesshop/product/1`) work on Pages.

## Data layer: SQLite API with localStorage fallback

- When `npm run server` is up, `AuthContext`/`StoreContext` use the SQLite API (`src/lib/api.ts`, `isApiAvailable()` probe, `database/mono-shop.db` with 7 tables: `users, categories, products, product_images, cart_items, orders, order_items`). When the API is unreachable (e.g. GitHub Pages), they fall back to localStorage. Keys: `shoes_shop_users_v2`, `shoes_shop_current_user_v2`, `monoStepProducts`, `shoes_shop_orders_v1`, `shoes_shop_cart_<userId>` (see `src/context/*` and `src/utils/localStorage.ts`).
- Passwords in SQLite are bcrypt-hashed (`bcryptjs`); the localStorage fallback still uses plaintext (demo). Seeded accounts: admin `admin2547`/`admin2547` (super admin — cannot be demoted/deleted, enforced server-side too), `demo`/`password123`, `kanda`/`password123` (see `database/seed-users.ts`).
- `sizes` is stored as a JSON array string in `products.sizes`. `order_items` keeps name/price/image snapshots so later catalog edits don't rewrite history. Order creation is one transaction: insert order+items → decrement stock → clear cart.
- Frontend mutations are async (`addProduct`, `createOrder`, `login`, `register`, admin user ops return Promises) — callers must `await`/`void` them.
- Server runs via `tsx` (not plain `node`) because it imports `.ts` seed modules with extensionless imports.
- `getStoredProducts` merges any `INITIAL_PRODUCTS` entries missing from stored data (by id) and auto-migrates a known stale image. Edits to `INITIAL_PRODUCTS`/`INITIAL_ORDERS` will NOT replace what a browser already has in localStorage — only new ids get appended. To see changes, clear localStorage or use the admin "reset" buttons.
- Adding to cart requires a logged-in user (toast shows otherwise). New products are prepended with `id = max(id)+1`.

## Conventions

- Imports use relative paths (`./`, `../`); the `@/*` alias is configured (maps to repo root) but unused. `allowImportingTsExtensions` means some imports include `.tsx` (see `src/main.tsx`).
- User-facing copy mixes English and Thai; keep toasts/order-related copy in Thai.
- `metadata.json` and `.env.example` declare a server-side Gemini capability (`@google/genai` is a dependency), but no server or Gemini call exists in the codebase — it is a static SPA. Don't assume any server-side flow.