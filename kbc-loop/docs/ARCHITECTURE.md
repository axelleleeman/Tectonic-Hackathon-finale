# KBC Loop architecture

KBC Loop is an npm workspaces monorepo with three front ends, one API and one SQLite database. All business
logic (catalogue, pricing, impact, signals, the state reducer) lives in `packages/shared` and runs the same way
in the browser, on the phone and on the server.

See also: [README](../../README.md) for setup and scripts, [DEMO.md](DEMO.md) for the pitch demo, and
[openapi.yaml](openapi.yaml) for the REST contract.

## Overview

```mermaid
flowchart LR
  subgraph Clients
    web["apps/web<br/>Vite + React<br/>KBC LOOP site, partner portal,<br/>presenter panel, dashboards"]
    app["apps/app<br/>Expo / React Native<br/>iOS, Android, web (/app/)"]
    insights["apps/insights<br/>Vite + React<br/>KBC Loop Insights (/kbc/)"]
  end

  subgraph Packages
    shared["packages/shared<br/>data, engine, reducer,<br/>Kate, API client"]
    webui["packages/web-ui<br/>React building blocks<br/>for web + insights"]
  end

  subgraph Server["apps/api (Node, http + ws)"]
    rest["REST<br/>GET /api/state<br/>POST /api/actions<br/>GET /api/catalog, /api/insights"]
    ws["WebSocket<br/>/api/live"]
    reducer["loopReducer<br/>(from shared)"]
  end

  db[("SQLite (node:sqlite)<br/>loop_state, action_log,<br/>partners, products")]

  web -- "HTTPS: POST actions" --> rest
  app -- "HTTPS: POST actions" --> rest
  insights -- "HTTPS: GET insights, POST actions" --> rest
  ws -- "WSS: live state" --> web
  ws -- "WSS: live state" --> app
  ws -- "WSS: live state" --> insights
  rest --> reducer --> db
  reducer -. "broadcast new version" .-> ws

  shared -.-> web
  shared -.-> app
  shared -.-> insights
  shared -.-> reducer
  webui -.-> web
  webui -.-> insights
```

In production a single container runs the API, which also serves the built web at `/`, Insights at `/kbc/` and
the app's web export at `/app/`, so everything shares one HTTPS origin.

## Data flow of an action

Example: the partner sets a repair to "Technician on the way" while the customer has the app open.

```mermaid
sequenceDiagram
  participant P as Partner portal (web)
  participant A as apps/api
  participant R as loopReducer (shared)
  participant D as SQLite
  participant C as App and dashboards

  C->>A: WebSocket /api/live (subprotocol kbc-loop)
  A-->>C: { type: 'state', version, state }
  P->>A: POST /api/actions { type: 'PARTNER_UPDATE_REPAIR', ... }
  A->>A: origin allowlist, API key, rate limit, JSON + size checks
  A->>R: reduce(state, action)
  R-->>A: new state (or validation error -> 400)
  A->>D: save loop_state + append action_log (one transaction)
  A-->>P: 200 { version, state }
  A-->>C: broadcast { type: 'state', version, state }
  C->>C: re-render (status line, notification, Kate tip)
```

1. A client builds an action with the helpers in `packages/shared/src/state/actions.js`.
2. The shared API client (`packages/shared/src/client.js`) sends it as `POST /api/actions`.
3. The API checks the request (see below) and applies the pure reducer `loopReducer.js`, which validates the
   action type and its fields.
4. The new state and the action are stored in SQLite; the version number increases.
5. The API pushes the new state over the WebSocket to every connected client, so the web, the app and Insights
   update within the same second, also across devices.

Clients never write over the socket: it is read only. Derived views (costs, impact, dashboards, campaign
results) are computed on the client from the state with the shared `engine/` functions.

## Security model

| Control | Where | What it does |
|---|---|---|
| Origin allowlist | `apps/api/src/security.js` | No `*` in CORS. Only the API's own origin and `ALLOWED_ORIGINS` may call REST or open the WebSocket; others get `403`. |
| API key (optional) | `API_KEY` | `Authorization: Bearer <key>` or WebSocket subprotocol `key.<key>`, compared in constant time. Required on everything except health checks when set. |
| Rate limits | `apps/api/src/security.js` | Per IP address: 60 writes and 600 reads per minute. Behind a proxy only the trusted hop's `x-forwarded-for` entry counts (`PROXY_HOPS`). |
| Input validation | `server.js`, `loopReducer.js`, `partnerFeed.js` | Known action types only, `application/json` only, 16 kB body limit, 1 kB WebSocket messages, strict feed validation, generic error messages. |
| Security headers | API + static server | CSP (`script-src 'self'`, `frame-ancestors 'self'`, `object-src 'none'`), `nosniff`, `SAMEORIGIN`, `no-referrer`, Permissions-Policy, COOP, HSTS in production. |
| Transport | `packages/shared/src/client.js` | Production builds only talk `https`/`wss`; plain `http`/`ws` is allowed for `localhost` and in development only. |
| No secrets in clients | build config | `VITE_*` and `EXPO_PUBLIC_*` values are public. The optional key only keeps casual traffic out; no real credentials ship in any bundle or in the repo. |
| Supply chain | Dockerfile, CI | `npm ci --ignore-scripts` from the lockfile; the container runs as non-root with a read-only code directory. |

## Packages

- `packages/shared`: plain JavaScript, no React. `data/` (fictional customers, partners, products),
  `engine/` (pricing, costs, impact, signals, insights, campaigns), `state/` (reducer, actions, derive),
  `kate/` (conversation engine) and `client.js`.
- `packages/web-ui`: React hooks and components shared by `apps/web` and `apps/insights` (`useLoop`, Kate panel,
  styles, logo).

## Continuous integration

`.github/workflows/ci.yml` (repository root) runs on every push and pull request to `main`: Node 24,
`npm ci --ignore-scripts`, `npm test` (shared + API tests + README check), `npm run lint` and `npm run build`.
