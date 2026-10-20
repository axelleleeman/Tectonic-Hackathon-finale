# KBC Loop – Tectonic Hackathon (KBC challenge)

## ▶️ How to open the demo (read this first)

Open the three parts **in this order**. Everything shares one live state, so what you do in one shows up in the others.

| Step | Open | Where | What it is |
|---|---|---|---|
| 0 | Start everything | Terminal in this folder: `npm install` (first time) → `npm run demo:reset` → `npm run dev` | Starts the api, website, dashboard and app bundler. Keep this terminal open. |
| **1** | **The website** | **http://localhost:5173/#loop** | KBC LOOP for the customer (Lotte): home, impact, rewards, catalogue, product pages, Kate tips |
| **2** | **The app in the iPhone simulator** | Second terminal in this folder: `npm run open:app` | The KBC Mobile app with KBC Loop (opens Expo Go in the iOS Simulator). Also clickable inside the website under **Explore the app** → **Open the app large** |
| **3** | **The management dashboard** | **http://localhost:5174** | KBC Loop Insights for KBC staff: opportunities, partners, campaigns |

Also useful during the pitch:

- Partner portal (repair partner view): http://localhost:5173/#partner
- One-slide explainer "expenditure pattern → data insight → Kate": http://localhost:5173/kate-flow.html
- Step-by-step pitch script: [docs/DEMO.md](docs/DEMO.md)

**Do not open** `http://localhost:4000` (that is the api, it has no page) or `http://localhost:8081` in a browser (that is the app bundler; use the simulator or **Explore the app** instead).
Before every demo run `npm run demo:reset` so Lotte starts with 10 products and 350 Kate Coins. Requirements: Node 24+, and for step 2 a Mac with Xcode's iOS Simulator and Expo Go installed in it (if Expo Go is missing, run `npm run dev:app` once and press `i`).

---


**Borrow instead of buy, in KBC Mobile.** KBC Loop is a marketplace of circular partners inside the KBC
app. Customers borrow products (lighting, appliances, electronics, bikes, baby gear …) for a monthly fee.
The partner stays the owner, **repairs** the product when it breaks and takes it back at the end for reuse.
That gives manufacturers a direct interest in making products that last. KBC spots the right moment, brings
customer and partner together and arranges financing and insurance.

**The pitch in one paragraph.** Products break because producers earn when you buy again. KBC Loop flips that
incentive: the customer pays a monthly fee for the result, the producer keeps ownership and earns more the
longer the product lasts, and KBC orchestrates the ecosystem as bank (signals from transaction data, one split
payment, financing for producers) and insurer (built-in coverage, fleet and residual-value cover). Customers
see their costs and CO₂ impact, get repairs with one tap, earn Kate Coins for circular choices, and KBC staff
use anonymised insights to launch Kate campaigns. Web, app and Insights share one live state.

## Quick start

```bash
cd kbc-loop
npm install
npm run dev          # api :4000, web http://localhost:5173, insights http://localhost:5174, app http://localhost:8081
npm test             # shared + api tests + README check
```

Then open http://localhost:5173/#loop. Further reading:

- [docs/DEMO.md](docs/DEMO.md): the 4-minute pitch demo, step by step, with URLs and clicks
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): diagram, data flow of an action and the security model
- [docs/openapi.yaml](docs/openapi.yaml): the REST API contract
- CI: `.github/workflows/ci.yml` (repository root) runs `npm ci --ignore-scripts`, test, lint and build on Node 24
  for every push and pull request to `main`

## What the demo shows

| Perspective | What you see |
|---|---|
| **Customer** (KBC Mobile) | App rebuilt from a recording of the real KBC Mobile: Kate search bar at the top (Kate slides open from the top; close with ×, tapping outside, swiping up or the Android back button), floating menu bar Home · My KBC · Offers and a transfers button. Home with account cards, payments, Kate tips in "For you" based on transactions, Kate Wallet, insight into your finances, KBC Loop under Extra services, news and Sustainable together. My KBC with a KBC Loop block, Offers with a KBC Loop banner and categories. KBC Loop itself (MyLoop, categories and partners, buying vs. borrowing, life cycle, report a defect → repair, return → new life, Kate Coins) is the only interactive part |
| **Partner portal** (`#partner`) | Pick a partner (WashCycle, Philips, ReLapt …): KPIs and a live ticket list of open repairs across customers (first name only). Status buttons Schedule → On the way → In progress → Repaired update the customer's web product page and app repair tracker instantly |
| **KBC** (internal view) | Loop customers, financed volume, recurring margin, CO₂ impact, triple win |
| **KBC Loop Insights** (internal, separate app) | Anonymised spending groups, recommended rental products, launching a campaign via Kate |

Personas: **Lotte** (already borrows Philips lights, phone just repaired), **Jonas** (new house with a KBC home
loan → starter package), **Bakkerij Peeters** (SME, energy bill doubled → Light as a Service), **Sarah** (third
washing machine repair this year).

Presenter panel: the **"Play demo"** button plays the full flow automatically (± 45 s, ideal for recording
for the slides). **"Light reports wear"** simulates an IoT alert: Philips replaces the light before it fails.
The **privacy toggle** shows that without consent there are no suggestions based on transactions.

Borrowing (web and app) ends with a contract summary (fee, term, what's included, insurance via KBC, cancellation,
start date), "I agree" and a simulated **Confirm with KBC** step; afterwards the web offers "Download contract" (text
file) and the app shows the contract with Share. Products with a second-life offer show a **Refurbished** badge
(25% off); borrowing one uses the normal product and names the refurbished unit in the contract.

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
  docker-compose.yml runs that image locally: healthcheck on /api/health, named volume for the database
  docs/              openapi.yaml: OpenAPI 3.1 contract of every route, the error format and the /api/live protocol
  packages/
    shared/          @kbc-loop/shared: plain JavaScript, no React
      src/config/      demo settings (date, CO₂ factor, Kate Coins, bundle discount, KBC margin, technician slot)
      src/data/        data only: categories, partners, products (+ bundles), customers, repairIssues,
                       pilotStats, spendSegments, kbcServices, rewards (Kate Coins rewards: rewards, rewardById),
                       dataChoices (copy for the data-preferences screen on web and app, and KATE_LEVELS:
                       Basic / Proactive / Ecosystem),
                       partnerProfiles (about, key facts, services and demo certifications per partner; illustrative)
      src/engine/      logic: rules, signals, catalog, pricing, impact, dashboards, insights, kateIntents …
                       costs.js: cost overview per item and customer (paid, remaining, split, upcoming payments)
                       upgrades.js: upgrade options and quote for a borrowed product
                       campaigns.js: Kate campaign forecasts and results for KBC Loop Insights
                       rules.js also turns a running Insights campaign into a Kate tip for matching customers
                       signals.js applies the Kate level: basic = no proactive tips, proactive = no campaign tips,
                       ecosystem = campaign tips too (notifications follow the same rule)
      src/state/       loopReducer.js (all actions, with input validation, pure and tested; SET_DATA_PREFERENCES
                       stores the customer's data choices incl. kateLevel), actions.js,
                       derive.js (derive, notificationsFor: inbox items, unreadCount)
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
      src/             index.js (start + graceful shutdown), server.js (routes), db.js, live.js, security.js,
                       static.js, config.js, errors.js (JSON error format and codes),
                       logger.js (structured request log + X-Request-Id),
                       catalog.js (partner catalogue tables partners + products, seeded from shared data),
                       partnerFeed.js (strict validation of a partner product feed),
                       errors.js (one JSON error format { error: { code, message } }),
                       logger.js (structured JSON request logs, LOG_LEVEL silent/error/info)
      data-examples/   partner-feed.example.json: example feed of a fictional partner (GreenSpin)
      tests/
    web/             @kbc-loop/web: Vite + React, dev on http://localhost:5173
      index.html       KBC apps page (pixel-exact screenshot + KBC Loop tab and card), presenter panel,
                       Philips and KBC dashboards, the app in an iframe
      src/demo/        WebApp, presenter/ (presenter panel), dashboards/ (KBC dashboard; PartnerDashboard.jsx = the partner
                       portal on #partner, partnerTickets.js = its tickets and KPIs), site/ (KBC apps page)
      src/loop/        the KBC LOOP page: #loop (metrics with a small three.js loop from three/, "Your home" per
                       category, Kate tips, FAQ), #loop/catalog[/<category>] (alias #loop/marketplace: catalogue per
                       category and partner, with "How borrowing works" and "Our partners"), #loop/catalog/product/<productId>
                       (catalogue product page), #loop/partner/<partnerId> (partner page), #loop/product/<itemKey>, #loop/costs and #loop/presentation (URL only);
                       header without tabs, dialogs, light and dark theme; rewards/ (#loop/rewards: redeem Kate
                       Coins), inbox/ (notifications bell and panel in the header), share/ (impact card drawn with
                       Canvas 2D and downloaded as a PNG), consent/ (#loop/consent: choose what happens with your data)
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
                       screens (category, product, buying vs. borrowing, repair …); rewards/ (redeem Kate Coins),
                       inbox/ (notifications behind the header bell), share/ (impact card + native Share sheet),
                       consent/ (data preferences: Kate level, Kate tips, Insights, partners, connected devices)
      src/ui/          shared building blocks: Icon, Button, Stat, Photo, KateAvatar, KbcLogo …
      src/             api.js (API address + client), useLoop.js, navigation.js, theme.js
      app.json         Expo config (web under base path /app)
  docs/              ARCHITECTURE.md (diagram, data flow, security), DEMO.md (pitch script), openapi.yaml (REST API)
  scripts/           check-readme.mjs: checks that this README describes the actual structure
                     import-partner-feed.mjs: imports a partner product feed into the database (npm run import:feed)
                     check-openapi.mjs: checks that docs/openapi.yaml covers every route and action (npm run docs:check)
                     demo-reset.mjs: resets the shared demo state via the API (npm run demo:reset)
                     demo-reset.mjs: resets the shared demo state via the API (npm run demo:reset)
                     check-openapi.mjs: checks that docs/openapi.yaml covers every route and action (npm run docs:check)
```

**Extending:** adding a partner = `packages/shared/src/data/partners.js` + a profile in
`packages/shared/src/data/partnerProfiles.js` + products in `packages/shared/src/data/products.js`. A category = `packages/shared/src/data/categories.js`. A signal
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
npm test             # shared (signals, catalogue, pricing, impact, reducer, insights) + api (routes, security,
                     # health/ready, error format, request ids, shutdown) + README check + OpenAPI check
npm run docs:check   # docs/openapi.yaml documents every route, action type and error code
npm run demo:reset   # POST { type: 'RESET' } to API_URL (default http://127.0.0.1:4000; https required elsewhere; optional API_KEY)
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
| `GET` | `/api/health` | Liveness `{ status: 'ok', uptime, version }` (no key, no rate limit) |
| `GET` | `/api/ready` | Readiness: `{ status: 'ready' }` when the database answers, otherwise `503` (no key) |
| `GET` | `/api/ready` | Readiness: `{ status: 'ready' }` when the database answers, otherwise `503` (no key needed, rate limited) |
| `GET` | `/api/state` | Full demo state `{ version, state }` |
| `POST` | `/api/actions` | Apply an action `{ type, ... }` (known action types only), returns the new state |
| `GET` | `/api/actions/recent?limit=20` | Latest actions from the log (max. 100) |
| `GET` | `/api/insights?kind=&customerType=` | Anonymised groups + recommendations for KBC Loop Insights (`kind`: alle/herstelling/herhaalaankoop, `customerType`: alle/particulier/kmo) |
| `GET` | `/api/catalog` | Partner catalogue from the database: `{ categories, partners, products }`, same shapes as `packages/shared/src/data` |
| `GET` | `/api/catalog/partners/:id` | One partner with its `products` (`id` must match `^[a-z0-9-]{1,64}$`: otherwise `400`; unknown partner: `404`) |
| `WS` | `/api/live` | Subprotocol `kbc-loop`; sends `{ type: 'state', version, state }` on connect and on every change. Read only. |

The full contract is in [`docs/openapi.yaml`](docs/openapi.yaml) (OpenAPI 3.1).

**Errors** always have the shape `{ "error": { "code", "message" } }` with a stable `code`: `bad_request` (400),
`unauthorized` (401), `forbidden_origin` (403), `not_found` (404), `payload_too_large` (413),
`unsupported_media_type` (415), `rate_limited` (429), `internal` (500) and `unavailable` (503, `/api/ready`). The shared
client throws an `Error` with `message`, `code` and `status`.

**Request ids and logging**: every response has an `X-Request-Id` header (a valid incoming one,
`[A-Za-z0-9-]{1,64}`, is reused; otherwise a UUID). Every request is logged as one JSON line on stdout
(`ts`, `method`, `path` without query string, `status`, `ms`, `requestId`). **Graceful shutdown** on
`SIGTERM`/`SIGINT`: stop accepting connections, close WebSocket clients with code `1001`, finish in-flight requests,
close the database, exit (forced after 10 s).

API settings (environment variables, see `apps/api/src/config.js`):

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `4000` | Port |
| `HOST` | `127.0.0.1` | `0.0.0.0` to allow a phone on the same Wi-Fi |
| `DB_PATH` | `apps/api/data/kbc-loop.db` | SQLite file |
| `STATIC_DIR` | – | Folder with the built web (+ `kbc/` and `app/`) to serve as well (production) |
| `ALLOWED_ORIGINS` | local dev servers (5173, 5174, 8081) | Comma-separated list of websites allowed to call the API |
| `API_KEY` | – | Optional key, required on all API requests except `/api/health` and `/api/ready` |
| `TRUST_PROXY` | – | `true` behind an HTTPS proxy (Cloud Run) |
| `PROXY_HOPS` | `1` | number of trusted proxies in front of the API; determines which `x-forwarded-for` address counts for rate limiting |
| `NODE_ENV` | – | `production` enables HSTS |
| `LOG_LEVEL` | `info` | `info`, `error` or `silent` (silent by default under `node --test`) |

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
- **Rate limiting** per IP address: 60 write actions and 600 read requests per minute (checked before the API key,
  so key guessing is throttled too; `/api/health` is exempt).
- **Input validation and limits**: known action types only, `application/json` only, body max. 16 kB, filters
  against a fixed list, WebSocket messages max. 1 kB (and clients may not write via the socket), request
  time-outs. Internal errors reveal no details.
- **Security headers** on every page: Content-Security-Policy (`script-src 'self'`, `frame-ancestors 'self'`,
  `object-src 'none'` …), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: no-referrer`, Permissions-Policy, Cross-Origin-Opener-Policy and, in production, **HSTS**.
  The static server does not serve files outside `STATIC_DIR`.
- **https only outside localhost**: the shared API client refuses `http`/`ws` to other addresses, except in
  development mode.
- **Container**: runs as the non-root user `node` (UID 1000), code is read-only, only `/data` is writable, npm is not in
  the runtime image.
- **No secrets in the repo**: `.env` files and databases are in `.gitignore` and `.dockerignore`.
  Note: `EXPO_PUBLIC_*` and `VITE_*` variables end up readable in the app, web or Insights bundle and are therefore
  **not secrets**. `EXPO_PUBLIC_API_KEY`/`VITE_API_KEY` only shield the API from casual requests.
- **npm install scripts are disabled**: npm 12 does not run package install scripts by default, and the
  Dockerfile installs with `npm ci --ignore-scripts` exactly as in `package-lock.json`.
- **Dependency scan (Aikido)**: all open findings are in Expo's build tooling (`@expo/cli`, Metro), which only runs
  on the developer's laptop and is not in the runtime image (`apps/api` only depends on `ws`).
  - `uuid` (via `xcode`) and `zod` (via `@expo/cli`) are lifted to fixed versions with `overrides` in `package.json`
    (checked: `expo start` and `expo export` still work).
  - `braces` 3.0.3 (via Metro's file watcher) and `node-forge` 1.4.0 (Expo code signing for EAS Updates) have no
    fixed version on npm yet. Not reachable: braces only gets glob patterns from our own config, and we do not use
    Expo code signing. Accepted for the demo; update Expo as soon as a fix is released.

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

Local test: `docker compose up --build` (or `docker build -t kbc-loop . && docker run --rm -p 8080:8080 kbc-loop`)
and open http://localhost:8080. `docker-compose.yml` binds to localhost only, keeps the database in the named volume
`kbc-loop-data` (`/data`), runs with a read-only root filesystem and no capabilities, and uses `/api/health` as
healthcheck. Optional `API_KEY`, `ALLOWED_ORIGINS` and `LOG_LEVEL` come from a local `.env` file (never committed).

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
