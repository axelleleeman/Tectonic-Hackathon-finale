# KBC LOOP 🔁

> **Stop buying things. Start using them.**
> KBC LOOP is a Product-as-a-Service ecosystem by KBC. Customers pay monthly for the *result* (light, clean clothes, coffee, a working phone) instead of buying products that are built to break. Products stay in the loop: used, repaired, returned and remade.

## ▶️ How to open the demo (read this first)

### Start (once)

```bash
cd kbc-loop
npm install          # first time only
npm run demo:reset   # fresh demo: Lotte with 10 products and 350 Kate Coins
npm run dev          # starts api, website, dashboard and app bundler – keep this terminal open
```

### What is what

| Part | What it is | Open it via |
|---|---|---|
| **Website** | KBC LOOP for the customer: the story, your home, impact, rewards, catalogue, Kate tips | http://localhost:5173/#loop |
| **App** | The KBC Mobile app with KBC Loop (iPhone / Android), the same customer as on the website | `npm run open:app`, or **Explore the app** on the website |
| **Management dashboard** | KBC Loop Insights for KBC staff: opportunities, partners, campaigns | http://localhost:5174 |
| **Partner portal** | What a repair partner sees: live repair tickets and their status | http://localhost:5173/#partner |
| **API** (`localhost:4000`) | The backend that stores the shared live state. **Not a page**, never open it | runs automatically with `npm run dev` |

### Open in this order

| # | What | Link / command | Who it is for |
|---|---|---|---|
| **1** | **Website – KBC LOOP** | **http://localhost:5173/#loop** | The customer (Lotte) on the web |
| **2** | **App in the iPhone simulator** | second terminal: `cd kbc-loop` → **`npm run open:app`** | The customer in KBC Mobile |
| **3** | **Management dashboard – KBC Loop Insights** | **http://localhost:5174** | KBC staff (marketing / management) |
| 4 | Partner portal | http://localhost:5173/#partner | A repair partner (e.g. WashCycle) |

No simulator? The same app also runs inside the website: scroll to **Explore the app** → **Open the app large**.

### Every page

**Website (customer) – http://localhost:5173**

| Page | Link | What you see |
|---|---|---|
| KBC LOOP start screen | http://localhost:5173/#loop | Hero animation, the story (problem → solution → triple win → you stay in control), then **Home · Impact · Rewards**, Kate tips, Explore the app, Questions |
| Rewards tab | http://localhost:5173/#loop/rewards | Redeem Kate Coins |
| Product catalogue | http://localhost:5173/#loop/catalog | How borrowing works, all partners, all products per category |
| One catalogue product | http://localhost:5173/#loop/catalog/product/washer | Photo, price, buy vs. borrow, what's included, related products |
| Partner page | http://localhost:5173/#loop/partner/washcycle | About the partner, key facts, all its products |
| A product you have | http://localhost:5173/#loop/product/lotte-0 | Your Philips lamp: report a problem, upgrade, return, costs & contract |
| Cost overview | http://localhost:5173/#loop/costs | Monthly total, per category, upcoming payments |
| Your data (consent) | http://localhost:5173/#loop/consent | Kate level (Basic · Proactive · Ecosystem) and data choices |

**Dashboards (KBC and partners)**

| Page | Link | What you see |
|---|---|---|
| Insights – overview | http://localhost:5174/#/overview | KPIs, portfolio, 12-month trend, categories, top opportunities, partners |
| Insights – campaigns | http://localhost:5174/#/campaigns | Running campaigns with results; **Plan** starts the 4-step Kate campaign wizard |
| Insights – groups | http://localhost:5174/#/groups | All anonymised spending groups (sortable) |
| Partner portal | http://localhost:5173/#partner | Live repair tickets: Schedule → On the way → In progress → Repaired |

**Pitch extras**

| Page | Link | What it is |
|---|---|---|
| Demo script | [kbc-loop/docs/DEMO.md](kbc-loop/docs/DEMO.md) | The 4-minute demo, click by click |

### Do not open

- `http://localhost:4000` – that is the **api** (no page). Health check only: http://localhost:4000/api/health
- `http://localhost:8081` in a browser – that is the **app bundler**. Use `npm run open:app` or **Explore the app** instead.

### Good to know

- Everything shares **one live state**: an action in the app shows up on the website and in the dashboards immediately.
- Before every demo: `npm run demo:reset`. Seeing an old version? Hard refresh with **Cmd+Shift+R**.
- The Insights campaign only reaches Lotte as a Kate tip when her Kate level is **Ecosystem** (set it on the website under *You stay in control*).
- Requirements: Node 24+; for step 2 a Mac with Xcode's iOS Simulator and Expo Go (if Expo Go is missing: `npm run dev:app` once and press `i`).

---

## In short

**What it is.** A working prototype of KBC LOOP inside KBC Mobile. Kate spots a pattern in a customer's
transactions and asks the question the customer hasn't asked yet. For example, Sarah just paid for the
3rd repair of her washing machine this year, so KBC Mobile sends her a notification: *"Third repair this year,
Sarah? Rent a washing machine that's always fixed for you: €19.90 a month."* She borrows it from a circular
partner, who stays the owner and repairs it. KBC handles the financing, insurance and monthly payment.
Three views share one live state: the customer app (KBC Mobile style), the partner dashboard and KBC's
internal view (KBC Loop Insights).

**How to run it** (Node 22.13 or newer):

```bash
cd kbc-loop
npm install
npm run dev      # starts api, web, insights and app together
npm test         # engine, reducer and api tests + README check
```

| What | Where |
|---|---|
| Web: the KBC LOOP portal (opens directly; `http://localhost:5173` redirects to `#loop`) | http://localhost:5173/#loop |
| Customer app (KBC Mobile, web version) | http://localhost:8081 (or scan the QR code with Expo Go) |
| KBC Loop Insights (internal, for KBC staff) | http://localhost:5174/kbc/ |
| API (REST + WebSocket) | http://127.0.0.1:4000 |

**Demo flow:** in the presentation panel pick **Sarah**: the app shows the notification, *View proposal*
shows her three repairs and the cost of buying vs. renting, *Borrow* adds the machine, and *Report a defect*
follows the repair until it is fixed (no calls, no bill). Other personas: **Lotte** (phone repair, a lamp that
reports wear itself), **Jonas** (new KBC home loan → starter pack), **Bakkerij Peeters** (SME, energy bill
doubled → Light as a Service). *Play demo* runs a full flow automatically (± 45 s).

**Unfinished / limitations**

- **Fictional data only.** No real banking APIs: PSD2 transaction data, KBC Partner Hub, B2B Asset Financing and
  machine-to-machine payments are simulated with data in `kbc-loop/packages/shared/src/data/`.
- **Partners are examples.** Philips (Signify) is an example partner, not an existing collaboration; the other
  partners are fictional. Prices and CO₂ figures are indicative.
- **Not built yet as real flows:** the insurance module (claims), the billing split between partner, insurer and
  KBC, and spending Sustainability/Kate Coins (they can be earned, not yet redeemed).
- **Kate is rule-based.** Signals come from explainable rules (e.g. 3+ repairs of the same device in 12 months);
  the chat recognises questions by keywords, it is not a language model.
- **Demo infrastructure.** SQLite database, no customer login (only an optional API key). On Cloud Run the
  state resets on every restart and only one instance is supported.
- **Not public.** The web view imitates the KBC website and app (KBC logo, KBC Mobile style). It is meant only
  for the hackathon jury, not for public hosting without KBC's permission.

More detail (architecture, API, security, deployment): [Developer reference](#developer-reference).

---

## 1. The problem

We can fly to the moon, build robots and train AI, but we can't build a washing machine that lasts 10 years.

That isn't a technology problem. It's a business model problem: producers earn money when you **buy again**, so products are designed to wear out. This linear economy (take → make → throw away) runs on resources that are running out.

## 2. The solution

**Product-as-a-Service (PaaS).** Customers don't buy a lamp, they pay for light.

| | Today (linear) | With PaaS |
|---|---|---|
| Customer | Buys, repairs, replaces, worries | One monthly fee, no worries |
| Producer | Earns once, so plans obsolescence | Earns monthly, so builds products that **last** |
| Product at end of life | Container park | Back to the producer, materials reused |
| KBC | Processes the payment | **Orchestrates the whole ecosystem** |

The incentive flips: **the longer a product lasts, the more the producer earns.**

## 3. KBC LOOP: bank + insurer in one ecosystem

In KBC LOOP, KBC is the trusted party in the middle. It connects customers with ecosystem partners and adds two capabilities that no marketplace or Big Tech platform can combine: **banking** and **insurance**.

### 3.1 KBC Bank
- **Signals:** transaction data shows who keeps buying the same product (for example, three coffee machines in four years).
- **Billing:** one monthly payment, split automatically between partner, insurer and KBC.
- **Financing producers:** under PaaS, producers get paid monthly instead of up front. KBC finances that working-capital gap.

### 3.2 KBC Verzekeringen (KBC Insurance)
Insurance turns *"the producer fixes it"* into a guarantee the customer can trust.

| Insurance building block | For whom | What it does |
|---|---|---|
| **Built-in coverage** | Customer | Theft, accidental damage and breakdown are included in every subscription. No separate device insurance and no small print. |
| **Fleet & asset coverage** | Producer | The producer keeps ownership of thousands of devices at customers' homes. KBC Verzekeringen insures that fleet. |
| **Residual-value cover** | Producer + KBC | Protects the value of returned products and materials. This makes long-life design safer to invest in. |
| **Quality-based pricing** | Everyone | Products that rarely break lead to fewer claims and lower premiums. Insurance pricing **rewards durability**. |

**Why this matters:** the insurer and the producer now share the same goal, a product that never breaks. This closes the loop: durable products → fewer claims → cheaper subscriptions → more customers → more impact.

### 3.3 KBC Sustainability Coins 🌱
Sustainable behaviour should pay off, and you should be able to see it. Customers **earn Sustainability Coins** in KBC Mobile for every choice that keeps products and resources in use.

**Earn coins by:**

| Action | Why it's sustainable |
|---|---|
| Switching from buying to a subscription | One durable product instead of a series of short-lived ones |
| Keeping a product longer instead of upgrading | No new resources needed |
| Choosing a refurbished or older model | Extends the life of products that already exist |
| Returning a product at the end of the contract | Materials go back into the loop |
| Reporting a defect early (repair, not replace) | A small fix prevents a new purchase |

**Spend coins on:**
- A discount on your monthly subscription
- A lower premium with **KBC Verzekeringen**
- A free upgrade or extra service from a partner
- Donating to green projects (tree planting, renewable energy)

**Why this works:**
- **Customer:** gets rewarded for doing the right thing and sees their impact in the app (CO₂ avoided, kg of materials saved).
- **Partners:** reach loyal customers who keep products longer, which is exactly what PaaS profits from.
- **KBC:** daily engagement in KBC Mobile, a clear sustainability story, and measurable ESG impact.

> Sustainability Coins are **loyalty points inside KBC Mobile**. They are not a cryptocurrency or an investment product.

## 4. Customer journey (proof of concept)

```
1. SIGNAL     Anna bought her 3rd coffee machine in 4 years (transaction data, with her consent)
2. OFFER      KBC Mobile: "Coffee-as-a-service from <partner>: €X/month, repairs & insurance included"
3. CHOOSE     Anna chooses: subscribe, ignore, or turn this type of suggestion off
4. ACTIVATE   Partner delivers the machine · KBC Verzekeringen activates the coverage · KBC starts billing
              🌱 +Sustainability Coins for switching
5. USE        Machine breaks → one tap in the app → partner repairs or swaps, insurance covers it
              🌱 +coins for repairing instead of replacing, and for every year she keeps it
6. RETURN     End of contract → machine goes back to the partner → parts and materials are reused
              🌱 +coins for returning · Anna spends her coins on a lower insurance premium
```

Real-world precedent: Philips provides **Light-as-a-Service at Schiphol Airport**. Philips owns the fixtures, Schiphol pays for the light it uses, electricity use dropped 50% and fixtures last 75% longer. ([source](https://www.signify.com/en-in/our-company/news/press-release-archive/2015/20150416-Philips-provides-Light-as-a-Service-to-Schiphol-Airport))

## 5. Project structure

`kbc-loop/` is an npm-workspaces monorepo: shared code lives in `packages/`, everything that runs lives in `apps/`. See [Developer reference](#developer-reference) for setup, API and security details, [`kbc-loop/docs/ARCHITECTURE.md`](kbc-loop/docs/ARCHITECTURE.md) for the architecture and security model, [`kbc-loop/docs/DEMO.md`](kbc-loop/docs/DEMO.md) for the 4-minute demo script and [`kbc-loop/docs/openapi.yaml`](kbc-loop/docs/openapi.yaml) for the REST API.

**Quick start** (Node 22.13 or newer; CI uses Node 24):

```bash
cd kbc-loop
npm install
npm run dev     # api :4000, web http://localhost:5173, insights http://localhost:5174, app http://localhost:8081
npm test        # shared + api tests + README check
```

CI (`.github/workflows/ci.yml`) runs install, test, lint and build on every push and pull request to `main`.

```
kbc-loop/
├── docs/                    # ARCHITECTURE.md, DEMO.md (pitch script), openapi.yaml (REST API)
├── package.json             # Workspaces packages/* + apps/*; scripts: dev, dev:api, dev:web, dev:app,
│                            #   dev:insights, test, check:readme, lint, build
├── Dockerfile               # Builds web + insights + app web export, runs the API (Cloud Run)
│
├── packages/
│   ├── shared/              # @kbc-loop/shared: pure JS, no React
│   │   └── src/
│   │       ├── config/      # Demo settings (date, CO₂ factor, Kate Coins, bundle discount, KBC margin)
│   │       ├── data/        # Fictional data: categories, partners, products, customers, spend segments, KBC services
│   │       ├── engine/      # Signals/rules, catalog, pricing, impact, dashboards, insights, Kate intents
│   │       ├── state/       # loopReducer (all actions, with input validation), actions, derive
│   │       └── client.js    # API client (fetch + WebSocket), https-only outside localhost
│   └── web-ui/              # @kbc-loop/web-ui: shared web building blocks for apps/web + apps/insights
│       └── src/             # api.js (API_URL, APP_URL, INSIGHTS_URL, client), useLoop.js,
│                            #   components/, styles/, assets/ (KBC logo)
│
├── apps/
│   ├── api/                 # @kbc-loop/api: Node REST + WebSocket on SQLite; in production also serves
│   │                        #   web at /, KBC Loop Insights at /kbc/, app web export at /app/
│   ├── web/                 # @kbc-loop/web (Vite + React, :5173): the KBC LOOP portal (opens directly on #loop),
│   │                        #   presentation panel, Philips/KBC dashboards, the app in an iframe
│   ├── insights/            # @kbc-loop/insights (Vite + React, :5174, /kbc/): KBC Loop Insights, internal dashboard
│   │                        #   for KBC staff: anonymised spending groups, recommended rental products, Kate campaigns
│   └── app/                 # @kbc-loop/app: Expo SDK 58 app for iPhone + Android (+ web) in the KBC Mobile look;
│                            #   only KBC Loop is interactive (src/phone, src/screens, src/ui)
│
└── scripts/
    └── check-readme.mjs     # Fails `npm test` if this README no longer matches the code
```

All customers, accounts and amounts are fictional; no real data or third-party logos. Screen recordings are git-ignored because they can contain personal banking data.

### How the services connect

```
  apps/web (:5173, /)    apps/insights (:5174, /kbc/)    apps/app (Expo: iOS · Android · web /app/)
  dashboards, demo       internal KBC dashboard          customer: KBC Mobile + KBC Loop
        │                        │                                │
        └────────────────────────┼────────────────────────────────┘
                                 │  REST (GET /api/state, POST /api/actions, GET /api/insights)
                                 │  WebSocket /api/live (live state to every screen and device)
                                 ▼
                 apps/api (Node, http + ws) ── applies actions with the reducer from packages/shared
                                 │
                                 ▼
                    SQLite (node:sqlite): loop_state + action_log

  packages/shared: data, signal engine, reducer, derive and API client, used by web, insights, app and api
  packages/web-ui: shared React building blocks (API URLs, useLoop, components, styles) for web + insights
```

Inside the shared engine, the business flow from §2–3 is the same: transactions → signals (with consent) → offer in the app → contract (financing + insurance) → repair / return → impact and Kate Coins, all visible live in the Philips and KBC dashboards and in KBC Loop Insights.

## 6. Business model

Every monthly subscription is split between three parties. Illustrative example only; the figures are not validated:

| Washing-machine-as-a-service | €/month |
|---|---|
| Partner (product, maintenance, repair) | 15.50 |
| KBC Verzekeringen (coverage) | 2.00 |
| KBC (platform fee) | 1.50 |
| **Customer pays** | **19.00** |

A small share per subscription, multiplied across millions of customers, gives KBC a **recurring income stream** that grows with every new partner.

Coins that are redeemed are funded jointly by KBC and partners, as a loyalty budget. Customers who keep a product longer have lower costs for the partner and fewer claims for the insurer, so part of that saving flows back as coins.

## 7. Challenge design principles

| Principle | Our answer |
|---|---|
| Recognise signals | The world is running out of resources; repeat purchases are the signal. KBC can be the first bank to act on it. |
| Understand the context | Transaction data shows *what keeps breaking* and recommends the right subscription. |
| Activate KBC & partners | Not a product but an ecosystem: Bank + **Verzekeringen** + producers. |
| Customer in control | The customer chooses: buy or subscribe, share data or not, how proactive KBC may be. Sustainability Coins reward choices, they never force them. |
| Personalised & adaptive | Offers are based on the customer's own purchase patterns, and coin rewards adapt to their behaviour. |
| Triple win | Customer: no worries · Producer: recurring revenue + materials back · KBC: new income + closer relationship. |
| Bold, not minor | A new way of owning. Everyone rethinks how they buy. |
| Scalable | More clients → more partners → more impact. |
| Trustworthy | No built-in defects, just the best products, guaranteed by KBC Verzekeringen. |
| Commercially viable | A share of every monthly subscription and every insurance premium. |
| Proof of concept | Philips Light-as-a-Service at Schiphol + our coffee-machine journey. |

## 8. Roadmap

- [x] Signal engine on synthetic data (repeated repairs, energy spike, new home, device wear)
- [x] Consent setting + offer flow and notification in the KBC Mobile mock
- [x] Repair flow: report a defect in the app → partner plans and fixes it
- [x] Impact view: products in use, repairs instead of replacements, CO₂ avoided, coins earned
- [x] Categories: lighting, energy, appliances, electronics, mobility, family, business
- [ ] Insurance module: built-in coverage + claim flow
- [ ] Billing split (partner / insurance / KBC)
- [ ] Sustainability Coins: redeem for a discount or lower premium
- [ ] Real data: PSD2 transactions, KBC Partner Hub, B2B Asset Financing

---

*KBC LOOP: built for the KBC challenge "from intent to a successful action".*

---

# Developer reference

Everything below is for developers: all code lives in `kbc-loop/` (run the commands there). `npm test` checks that this section still matches the code (`kbc-loop/scripts/check-readme.mjs`).

## Quick start

```bash
cd kbc-loop
npm install
npm run dev          # api :4000, web http://localhost:5173, insights http://localhost:5174, app http://localhost:8081
npm test             # shared + api tests + README check
```

Then open http://localhost:5173/#loop. Further reading:

- [docs/DEMO.md](kbc-loop/docs/DEMO.md): the 4-minute pitch demo, step by step, with URLs and clicks
- [docs/ARCHITECTURE.md](kbc-loop/docs/ARCHITECTURE.md): diagram, data flow of an action and the security model
- [docs/openapi.yaml](kbc-loop/docs/openapi.yaml): the REST API contract
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
  │  KBC LOOP portal,      │ │  (Vite + React)        │ │  iOS + Android (Expo Go /    │
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
                       shared by the app's Kate screen and the web's Kate panel; tipVisual.js: data for the
                       "expenditure pattern → data insight → Kate" visual of each Kate tip (12-month sparkline,
                       highlighted transaction, insight, short line, price; pure and seeded, shared by web and app)
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
      index.html       the KBC LOOP portal (root URL redirects to #loop), presenter panel,
                       Philips and KBC dashboards, the app in an iframe
      src/demo/        WebApp, presenter/ (presenter panel), dashboards/ (KBC dashboard; PartnerDashboard.jsx = the partner
                       portal on #partner, partnerTickets.js = its tickets and KPIs)
      src/loop/        the KBC LOOP page: #loop (metrics with a small three.js loop from three/, "Your home" per
                       category, Kate tips, FAQ), #loop/catalog[/<category>] (alias #loop/marketplace: catalogue per
                       category and partner, with "How borrowing works" and "Our partners"), #loop/catalog/product/<productId>
                       (catalogue product page), #loop/partner/<partnerId> (partner page), #loop/product/<itemKey>, #loop/costs and #loop/presentation (URL only);
                       header without tabs, dialogs, light and dark theme; rewards/ (#loop/rewards: redeem Kate
                       Coins), inbox/ (notifications bell and panel in the header), share/ (impact card drawn with
                       Canvas 2D and downloaded as a PNG), consent/ (#loop/consent: choose what happens with your data),
                       kate/ (TipFlow.jsx + tipFlow.css: each Kate tip as expenditure pattern → data insight → Kate
                       card)
      src/hooks/       useAutoplay (plays the demo automatically), useHashRoute (KBC LOOP routes; no hash → #loop)
      src/styles/      styling of the site and the phone frame
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

The full contract is in [`docs/openapi.yaml`](kbc-loop/docs/openapi.yaml) (OpenAPI 3.1).

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

- Concept prototype, not an official KBC app or website. The KBC logo is used in the app and the presentation. Intended only for the hackathon presentation; do not put it online
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
