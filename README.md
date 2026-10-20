# KBC LOOP 🔁

> **Stop buying things. Start using them.**
> KBC LOOP is a Product-as-a-Service ecosystem by KBC. Customers pay monthly for the *result* (light, clean clothes, coffee, a working phone) instead of buying products that are built to break. Products stay in the loop: used, repaired, returned and remade.

## ▶️ How to open the demo (read this first)

Open the three parts **in this order**. Everything shares one live state, so what you do in one shows up in the others.

| Step | Open | Where | What it is |
|---|---|---|---|
| 0 | Start everything | Terminal: `cd kbc-loop` → `npm install` (first time) → `npm run demo:reset` → `npm run dev` | Starts the api, website, dashboard and app bundler. Keep this terminal open. |
| **1** | **The website** | **http://localhost:5173/#loop** | KBC LOOP for the customer (Lotte): home, impact, rewards, catalogue, product pages, Kate tips |
| **2** | **The app in the iPhone simulator** | Second terminal: `cd kbc-loop` → `npm run open:app` | The KBC Mobile app with KBC Loop (opens Expo Go in the iOS Simulator). Also clickable inside the website under **Explore the app** → **Open the app large** |
| **3** | **The management dashboard** | **http://localhost:5174** | KBC Loop Insights for KBC staff: opportunities, partners, campaigns |

Also useful during the pitch:

- Partner portal (repair partner view): http://localhost:5173/#partner
- One-slide explainer "expenditure pattern → data insight → Kate": http://localhost:5173/kate-flow.html
- Step-by-step pitch script: [kbc-loop/docs/DEMO.md](kbc-loop/docs/DEMO.md)

**Do not open** `http://localhost:4000` (that is the api, it has no page) or `http://localhost:8081` in a browser (that is the app bundler; use the simulator or **Explore the app** instead).
Before every demo run `npm run demo:reset` so Lotte starts with 10 products and 350 Kate Coins. Requirements: Node 24+, and for step 2 a Mac with Xcode's iOS Simulator and Expo Go installed in it (if Expo Go is missing, run `npm run dev:app` once and press `i`).

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
| Web with presentation panel, partner and KBC dashboards | http://localhost:5173 |
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

More detail (architecture, API, security, deployment): [`kbc-loop/README.md`](kbc-loop/README.md).

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

`kbc-loop/` is an npm-workspaces monorepo: shared code lives in `packages/`, everything that runs lives in `apps/`. See [`kbc-loop/README.md`](kbc-loop/README.md) for setup, API and security details, [`kbc-loop/docs/ARCHITECTURE.md`](kbc-loop/docs/ARCHITECTURE.md) for the architecture and security model, [`kbc-loop/docs/DEMO.md`](kbc-loop/docs/DEMO.md) for the 4-minute demo script and [`kbc-loop/docs/openapi.yaml`](kbc-loop/docs/openapi.yaml) for the REST API.

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
├── README.md                # Developer docs (checked by scripts/check-readme.mjs)
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
│   ├── web/                 # @kbc-loop/web (Vite + React, :5173): KBC apps page (screenshot + KBC Loop tab/card),
│   │                        #   presentation panel, Philips/KBC dashboards, the app in an iframe
│   ├── insights/            # @kbc-loop/insights (Vite + React, :5174, /kbc/): KBC Loop Insights, internal dashboard
│   │                        #   for KBC staff: anonymised spending groups, recommended rental products, Kate campaigns
│   └── app/                 # @kbc-loop/app: Expo SDK 58 app for iPhone + Android (+ web) in the KBC Mobile look;
│                            #   only KBC Loop is interactive (src/phone, src/screens, src/ui)
│
└── scripts/
    └── check-readme.mjs     # Fails `npm test` if kbc-loop/README.md no longer matches the code
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
