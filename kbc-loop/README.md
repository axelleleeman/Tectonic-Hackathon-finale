# KBC Loop – Tectonic Hackathon (KBC challenge)

**Borrow instead of buy, in KBC Mobile.** KBC Loop is a marketplace of circular partners inside the KBC
app. Customers borrow products (lighting, appliances, electronics, bikes, baby gear …) for a monthly fee.
The partner stays the owner, **repairs** the product when it breaks and takes it back at the end for reuse.
That gives manufacturers a direct interest in making products that last. KBC spots the right moment, brings
customer and partner together and arranges financing and insurance.

## What the demo shows

| Perspective | What you see |
|---|---|
| **Customer** (KBC Mobile) | App rebuilt from a recording of the real KBC Mobile: Kate search bar at the top (Kate slides open from the top; close with ×, tapping outside, swiping up or the Android back button), floating menu bar Home · My KBC · Offers and a transfers button. Home with account cards, payments, Kate tips in "For you" based on transactions, Kate Wallet, insight into your finances, KBC Loop under Extra services, news and Sustainable together. My KBC with a KBC Loop block, Offers with a KBC Loop banner and categories. KBC Loop itself (MyLoop, categories and partners, buying vs. borrowing, life cycle, report a defect → repair, return → new life, Kate Coins) is the only interactive part |
| **Philips** (partner view) | Active contracts, recurring revenue, defects predicted by sensors, live repair requests |
| **KBC** (internal view) | Loop customers, financed volume, recurring margin, CO₂ impact, triple win |
| **KBC Loop Insights** (internal, separate app) | Anonymised spending groups, recommended rental products, launching a campaign via Kate |

Personas: **Lotte** (already borrows Philips lights, phone just repaired), **Jonas** (new house with a KBC home
loan → starter package), **Bakkerij Peeters** (SME, energy bill doubled → Light as a Service), **Sarah** (third
washing machine repair this year).

Presenter panel: the **"Play demo"** button plays the full flow automatically (± 45 s, ideal for recording
for the slides). **"Light reports wear"** simulates an IoT alert: Philips replaces the light before it fails.
The **privacy toggle** shows that without consent there are no suggestions based on transactions.

## Built on existing KBC services

KBC Loop reuses 23 services from the KBC ecosystem list (`packages/shared/src/data/kbcServices.js`), visible in the demo:

- **Signal**: Query income and expenses via Kate, PSD2 Account Information Services, Home loan, Business CO2 insights
- **Proposal**: Kate, KBC Mobile, KBC Business app
- **Financing**: B2B Asset Financing (+ Partner Hub), Instalment Loan – Partner Hub (take-over)
- **Pay per use**: Machine-to-machine payment solutions (Philips Light as a Service)
- **Insurance**: Home insurance, Office and building insurance, Bicycle insurance, Online fraud insurance
- **Rewards**: Kate Coins, Joyn loyalty points
- **Impact**: ecoWise, Kube ESG, Energy consumption and saving tips
- **Partner onboarding**: KBC Partner Hub, KBC Developer Portal, Application status webhooks

In the app: "Based on" under *Why am I seeing this?*, the *Arranged behind the scenes by KBC* block on every
product, *Also at KBC* per category, ecoWise/Kube ESG in My KBC, and a full overview in the KBC view.

## Architecture

Three interfaces (web, Insights and app), one API and one database. What you do in the app appears immediately (via
WebSocket) in the dashboards on the web and in Insights, and vice versa, also across different devices.

```
  ┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────────────────┐
  │ apps/web (Vite+React)  │ │ apps/insights          │ │ apps/app (Expo/React Native) │
  │  KBC apps page,        │ │  (Vite + React)        │ │  iOS + Android (Expo Go /    │
  │  presenter panel,      │ │  KBC Loop Insights,    │ │  build), web version under   │
  │  Philips and KBC       │ │  internal, under /kbc/ │ │  /app/ (also as an iframe in │
  │  dashboards            │ │                        │ │  the web, Customer view)     │
  └───────────┬────────────┘ └───────────┬────────────┘ └──────────────┬───────────────┘
              │                          │                             │
              └──────────────────────────┼─────────────────────────────┘
                                         │  REST (GET state, POST actions)
                                         │  WebSocket /api/live (live state)
                                         ▼
                     ┌──────────────────────────────────────┐
                     │ apps/api  (Node, http + ws)          │
                     │  reducer from shared applies actions │
                     │  in production also serves web (/),  │
                     │  insights (/kbc/) and app (/app/)    │
                     └─────────────────┬────────────────────┘
                                       ▼
                            SQLite (node:sqlite)
                       loop_state  +  action_log

  packages/shared: data, engine, reducer and API client: used by web, insights, app and api
  packages/web-ui: shared React building blocks (API address, useLoop, components, styles) for web + insights
```

## Structure

npm workspaces monorepo: shared code in `packages/`, everything that runs in `apps/`.

```
kbc-loop/
  package.json       npm workspaces (packages/*, apps/*) + scripts dev/test/build/lint
  Dockerfile         production image: builds web + insights + app, runs the api (Cloud Run)
  packages/
    shared/          @kbc-loop/shared: plain JavaScript, no React
      src/config/      demo settings (date, CO₂ factor, Kate Coins, bundle discount, KBC margin, technician slot)
      src/data/        data only: categories, partners, products (+ bundles), customers, repairIssues,
                       pilotStats, spendSegments, kbcServices
      src/engine/      logic: rules, signals, catalog, pricing, impact, dashboards, insights, kateIntents …
                       costs.js: cost overview per item and customer (paid, remaining, split, upcoming payments)
                       upgrades.js: upgrade options and quote for a borrowed product
                       campaigns.js: Kate campaign forecasts and results for KBC Loop Insights
      src/state/       loopReducer.js (all actions, with input validation, pure and tested), actions.js, derive.js
      src/kate/        Kate's conversation engine (greeting, suggestions, intents, replies as action descriptors),
                       shared by the app's Kate screen and the web's Kate panel
      src/navigation/  tabs.js: the five KBC Mobile tabs (Home, My KBC, Invest, Business, Loop), shared by app and web
      src/ui/          iconPaths.js: SVG path data for line icons, shared by app and web; illustrations/
      src/client.js    API client (fetch + WebSocket) for web, insights and app; https only outside localhost
      tests/
    web-ui/          @kbc-loop/web-ui: shared web building blocks for apps/web and apps/insights
      src/api.js       API_URL, APP_URL, INSIGHTS_URL and the client
      src/useLoop.js   React hook: live state + actions
      src/useTheme.js  light/dark theme (follows the system until the user picks one; used by Insights)
      src/components/  Connecting, Icon, icons, KbcLogo, ProductImage (photo or illustration), ServiceChips, Stat
      src/kate/        Kate for the web: KateLauncher (header button), KatePanel (chat drawer), Kate, useKateConversation
      src/styles/      tokens, components, layout, dashboard, loop-theme
      src/assets/      KBC logo
  apps/
    api/             @kbc-loop/api: REST + WebSocket on SQLite
      src/             index.js (start), server.js (routes), db.js, live.js, security.js, static.js, config.js,
                       catalog.js (partner catalogue tables partners + products, seeded from shared data),
                       partnerFeed.js (strict validation of a partner product feed)
      data-examples/   partner-feed.example.json: example feed of a fictional partner (GreenSpin)
      tests/
    web/             @kbc-loop/web: Vite + React, dev on http://localhost:5173
      index.html       KBC apps page (pixel-exact screenshot + KBC Loop tab and card), presenter panel,
                       Philips and KBC dashboards, the app in an iframe
      src/demo/        WebApp, presenter/ (presenter panel), dashboards/, site/ (KBC apps page)
      src/loop/        the KBC LOOP page: #loop (metrics with a small three.js loop from three/, "Your home" per
                       category, Kate tips, FAQ), #loop/catalog[/<category>] (alias #loop/marketplace: catalogue per
                       category and partner), #loop/product/<itemKey>, #loop/costs and #loop/presentation (URL only);
                       header without tabs, dialogs, light and dark theme
      src/hooks/       useAutoplay (plays the demo automatically), useHashRoute (KBC apps page ↔ KBC LOOP)
      src/styles/      styling of the site and the phone frame
      src/assets/      screenshot parts of the KBC apps page
    insights/        @kbc-loop/insights: KBC Loop Insights, internal dashboard for KBC staff
      src/             InsightsApp.jsx, main.jsx, model.js, useInsights.js, useRoute.js,
                       pages/, campaign/, components/, styles/
                       dev on http://localhost:5174, in production under /kbc/
    app/             @kbc-loop/app: Expo SDK 58 app (iPhone, Android and web)
      App.js           app entry point
      src/phone/       KBC Mobile frame: AppBar (Kate search bar), TabBar (floating menu bar), Fab
      src/kate/        Kate as a full chat screen (KateScreen, header, messages, chips, input field)
      src/screens/     screens: home/ (Home), mykbc/ (My KBC), aanbod/ (Offers), item/, costs/ and the KBC Loop
                       screens (category, product, buying vs. borrowing, repair …)
      src/ui/          shared building blocks: Icon, Button, Stat, Photo, KateAvatar, KbcLogo …
      src/             api.js (API address + client), useLoop.js, navigation.js, theme.js
      app.json         Expo config (web under base path /app)
  scripts/           check-readme.mjs: checks that this README describes the actual structure
                     import-partner-feed.mjs: imports a partner product feed into the database (npm run import:feed)
```

**Extending:** adding a partner = `packages/shared/src/data/partners.js` + products in
`packages/shared/src/data/products.js`. A category = `packages/shared/src/data/categories.js`. A signal
= a rule in `packages/shared/src/engine/rules.js`.

**KBC Loop Insights** (`apps/insights`, in production at `/kbc/`): internal tool for KBC staff. Shows, anonymised,
which products customers often buy or have repaired (e.g. payments to bike shops or phone repairers), what that
costs per year and which rental product you could offer that group (data from `GET /api/insights`). Groups
under 100 customers are never shown. Overview (four KPIs, one chart, top 3 opportunities), Campaigns and Groups;
a campaign is planned in four steps (group → Kate message with phone preview → audience and budget → review) and
then shows simulated live results (`engine/campaigns.js`). Running campaigns appear live in the KBC dashboard on
the web. Same style as the KBC LOOP page (IBM Plex Sans, light and dark theme).

## Getting started (development)

Requires Node 22.13 or newer (for the built-in `node:sqlite`).

```bash
cd kbc-loop
npm install          # all workspaces at once
npm run dev          # api + web + insights + app together (concurrently)
```

Or separately, each in its own terminal:

```bash
npm run dev:api      # api on http://127.0.0.1:4000 (database: apps/api/data/kbc-loop.db)
npm run dev:web      # web on http://localhost:5173
npm run dev:insights # KBC Loop Insights (internal) on http://localhost:5174
npm run dev:app      # Expo dev server on port 8081 (QR code for Expo Go, w = web, i = iOS, a = Android)
```

In development, web and Insights look for the API on port 4000 of the same computer, the app (for the iframe in
the *Customer* view) on port 8081 and Insights on port 5174. Other addresses: `VITE_API_URL`,
`VITE_APP_URL` and `VITE_INSIGHTS_URL`.

### The app on an iPhone or Android phone (Expo Go)

1. Install **Expo Go** on the phone. Phone and computer must be on the **same Wi-Fi**.
2. Let the API listen on the network, with a key:
   ```bash
   HOST=0.0.0.0 API_KEY=choose-a-long-random-key npm run dev:api
   ```
3. Start the app with the same key and scan the QR code with the camera (iPhone) or in Expo Go (Android):
   ```bash
   EXPO_PUBLIC_API_KEY=choose-a-long-random-key npm run dev:app
   ```
   The app finds the API address itself: the same IP address as the Expo dev server, port 4000. If that fails
   (e.g. with `--tunnel`), set `EXPO_PUBLIC_API_URL=http://<your-computer-ip>:4000`.
4. If you also use the key for web and Insights, set `VITE_API_KEY` to the same value for
   `npm run dev:web` and `npm run dev:insights`.

Unencrypted `http` to your laptop is only allowed in development mode; a production build of web, Insights or
app refuses everything except `https`/`wss` (except `localhost`).

### Simulators

- **iOS simulator** (macOS with Xcode): `npm run dev:app` and press `i`. The simulator reaches the API via `localhost:4000`.
- **Android emulator** (Android Studio): `npm run dev:app` and press `a`. The app uses the dev server's address,
  or `10.0.2.2:4000` (the computer behind the emulator).
- **Web**: press `w`, or open http://localhost:8081.

## Tests

```bash
npm test             # shared (signals, catalogue, pricing, impact, reducer, insights) + api (routes, security) + README check
```

Uses Node's built-in test runner (`node --test`), without extra packages. `npm run lint` checks the code of
web and Insights (ESLint). `npm run build` creates the production build in `apps/web/dist/`: first the web,
then Insights (in `apps/web/dist/kbc`) and finally the web export of the app (in `apps/web/dist/app`).

## Keeping the documentation up to date

```bash
npm run check:readme # also runs automatically as the last step of npm test
```

`scripts/check-readme.mjs` checks that this README still matches the code: every app (`apps/*`) and every
package (`packages/*`), their subfolders in `src/`, every file in `apps/api/src`, every npm script in
`package.json` and every API path in `apps/api/src/server.js` and `apps/api/src/live.js` must be mentioned here. If
anything is missing, the script prints a list and `npm test` fails. When you add an app, package, folder, script or
API path, update the *Structure* block, the scripts or the API table above.

## API

| Method | Path | What |
|---|---|---|
| `GET` | `/api/health` | Status `{ ok: true }` (no key needed, for health checks) |
| `GET` | `/api/state` | Full demo state `{ version, state }` |
| `POST` | `/api/actions` | Apply an action `{ type, ... }` (known action types only), returns the new state |
| `GET` | `/api/actions/recent?limit=20` | Latest actions from the log (max. 100) |
| `GET` | `/api/insights?kind=&customerType=` | Anonymised groups + recommendations for KBC Loop Insights (`kind`: alle/herstelling/herhaalaankoop, `customerType`: alle/particulier/kmo) |
| `GET` | `/api/catalog` | Partner catalogue from the database: `{ categories, partners, products }`, same shapes as `packages/shared/src/data` |
| `GET` | `/api/catalog/partners/:id` | One partner with its `products` (`id` must match `^[a-z0-9-]{1,64}$`: otherwise `400`; unknown partner: `404`) |
| `WS` | `/api/live` | Subprotocol `kbc-loop`; sends `{ type: 'state', version, state }` on connect and on every change. Read only. |

API settings (environment variables, see `apps/api/src/config.js`):

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `4000` | Port |
| `HOST` | `127.0.0.1` | `0.0.0.0` to allow a phone on the same Wi-Fi |
| `DB_PATH` | `apps/api/data/kbc-loop.db` | SQLite file |
| `STATIC_DIR` | – | Folder with the built web (+ `kbc/` and `app/`) to serve as well (production) |
| `ALLOWED_ORIGINS` | local dev servers (5173, 5174, 8081) | Comma-separated list of websites allowed to call the API |
| `API_KEY` | – | Optional key, required on all API requests except `/api/health` |
| `TRUST_PROXY` | – | `true` behind an HTTPS proxy (Cloud Run) |
| `PROXY_HOPS` | `1` | number of trusted proxies in front of the API; determines which `x-forwarded-for` address counts for rate limiting |
| `NODE_ENV` | – | `production` enables HSTS |

Front-end settings (baked in at build time, so **no secrets**):

| Variable | For | Meaning |
|---|---|---|
| `VITE_API_URL` | web, insights | API address (default port 4000 in dev, same address in production) |
| `VITE_APP_URL` | web | App address for the iframe (default port 8081 in dev, `/app/` in production) |
| `VITE_INSIGHTS_URL` | web | KBC Loop Insights address (default port 5174 in dev, `/kbc/` in production) |
| `VITE_API_KEY` | web, insights | Same value as `API_KEY`, if set |
| `EXPO_PUBLIC_API_URL` | app | API address (by default discovered via the Expo dev server) |
| `EXPO_PUBLIC_API_KEY` | app | Same value as `API_KEY`, if set |

## Partner catalogue and product feeds

On startup the api creates the tables `partners` and `products` in the same SQLite database and seeds them
once from `packages/shared/src/data` (idempotent: nothing happens when partners already exist). Categories
stay in the shared data. The catalogue is read-only over HTTP (`GET /api/catalog`,
`GET /api/catalog/partners/:id`); partners deliver their own catalogue as a JSON feed, imported via the CLI:

```bash
npm run import:feed -- apps/api/data-examples/partner-feed.example.json            # into DB_PATH or apps/api/data/kbc-loop.db
node scripts/import-partner-feed.mjs <feed.json> --db apps/api/data/kbc-loop.db    # explicit database
```

A feed is `{ partner, products }` with the fields of `partners.js` and `products.js`: `partner` has `id`,
`name`, `short` (optional), `tagline` and `category` (a known category id); each product has `id`, `name`,
`detail`, `icon`, `for`, `monthly`, `buyPrice`, `termMonths`, `co2Kg`, `includes` and optionally
`expectedRepairs`, `insuranceMonthly`, `energySavingMonthly`, `connected` and `payPerUse` (`partnerId` comes from the
feed's partner). Validation (`apps/api/src/partnerFeed.js`) is strict: unknown fields, wrong types,
out-of-range or non-finite numbers, too-long strings, duplicate ids and files over 512 KB are rejected and nothing
is written. A valid feed is upserted in one transaction and replaces that partner's previous products; product ids
that belong to another partner are refused. A running api picks up the import on the next request.

## Security

- **No `*` in CORS**: only the own origin and the websites in `ALLOWED_ORIGINS` may call the API (also for the
  WebSocket). Other origins get `403`. If you open web or Insights via your laptop's IP address, add that address
  to `ALLOWED_ORIGINS`.
- **Optional API key** (`API_KEY`): via the header `Authorization: Bearer <key>`, or for the WebSocket as
  subprotocol `key.<key>`. Constant-time comparison. Recommended as soon as the API is on a network; the API
  warns at startup when it is not set.
- **Rate limiting** per IP address: 60 write actions and 600 read requests per minute.
- **Input validation and limits**: known action types only, `application/json` only, body max. 16 kB, filters
  against a fixed list, WebSocket messages max. 1 kB (and clients may not write via the socket), request
  time-outs. Internal errors reveal no details.
- **Security headers** on every page: Content-Security-Policy (`script-src 'self'`, `frame-ancestors 'self'`,
  `object-src 'none'` …), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: no-referrer`, Permissions-Policy, Cross-Origin-Opener-Policy and, in production, **HSTS**.
  The static server does not serve files outside `STATIC_DIR`.
- **https only outside localhost**: the shared API client refuses `http`/`ws` to other addresses, except in
  development mode.
- **Container**: runs as the non-root user `node`, code is read-only, only `/data` is writable, npm is not in
  the runtime image.
- **No secrets in the repo**: `.env` files and databases are in `.gitignore` and `.dockerignore`.
  Note: `EXPO_PUBLIC_*` and `VITE_*` variables end up readable in the app, web or Insights bundle and are therefore
  **not secrets**. `EXPO_PUBLIC_API_KEY`/`VITE_API_KEY` only shield the API from casual requests.
- **npm install scripts are disabled**: npm 12 does not run package install scripts by default, and the
  Dockerfile installs with `npm ci --ignore-scripts` exactly as in `package-lock.json`.

## Deploying (Google Cloud Run)

The `Dockerfile` builds the web (`apps/web/dist`), KBC Loop Insights (`apps/web/dist/kbc`) and the web version of
the app (`apps/web/dist/app`) and produces a small image that only runs the API
(`node apps/api/src/index.js`, with `STATIC_DIR` pointing to the built files). The API serves the web at `/`,
Insights at `/kbc/` and the app at `/app/`: everything on one HTTPS address, so no extra CORS is needed.

```bash
cd kbc-loop
gcloud run deploy kbc-loop --source . --region europe-west1 --max-instances 1
# No API_KEY needed: web, Insights and app run on the same address. If you do set API_KEY,
# VITE_API_KEY/EXPO_PUBLIC_API_KEY must get the same value at build time (the Dockerfile does not do that).
```

Local test: `docker build -t kbc-loop . && docker run --rm -p 8080:8080 kbc-loop` and open http://localhost:8080.

- **SQLite on Cloud Run is temporary**: each instance has its own database, which disappears on a restart or
  new revision. For the demo `--max-instances 1` is enough (one shared state). For real use: a mounted volume
  for `/data`, or a real database (e.g. Cloud SQL).
- **Not public without KBC's permission**: the web view imitates kbc.be (screenshot, KBC logo). Do not put the
  service online publicly without KBC's permission; leave out `--allow-unauthenticated` and use e.g. IAM or
  Identity-Aware Proxy, or share it only with the jury.

## Limitations / disclaimers

- Concept prototype, not an official KBC app or website. The web view imitates the KBC apps page, with the
  KBC logo, the hero photo and the app icons from a screenshot (`apps/web/src/assets/site/`). The KBC logo is
  also used in the app and the presentation. Intended only for the hackathon presentation; do not put it online
  publicly without KBC's permission. The customer app imitates the style of KBC Mobile (based on a screen
  recording of the real app) with its own icons; logos of other brands are not copied. Only KBC Loop is
  interactive; the rest of the app is scenery.
- Customers, accounts and amounts are fictional and indicative. Philips (Signify) is an example partner, not an
  existing collaboration; all other partners are fictional.
- No real banking APIs: data lives in `packages/shared/src/data/`. Next step: PSD2/transaction data, KBC Partner
  Hub, B2B Asset Financing and M2M payments for pay-per-use.
- Signal detection is rule-based and explainable; Kate recognises questions by keywords.
- No API keys or secrets in this repo.
- **Screen recordings and videos are in `.gitignore`**: they may contain personal banking data. Never put them
  in git, including those of the real KBC Mobile app that served as a reference.
