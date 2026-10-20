# KBC Loop – Tectonic Hackathon (KBC-challenge)

**Lenen in plaats van kopen, in KBC Mobile.** KBC Loop is een marktplaats van circulaire partners
in de KBC-app. Klanten lenen producten (verlichting, toestellen, elektronica, fietsen, babyspullen …)
tegen een maandbedrag. De partner blijft eigenaar, **herstelt** het product als het kapot gaat en neemt
het op het einde terug voor hergebruik. Daardoor hebben producenten er zelf belang bij om producten te
maken die lang meegaan. KBC herkent het juiste moment, brengt klant en partner samen en regelt
financiering en verzekering.

## Wat de demo toont

| Perspectief | Wat je ziet |
|---|---|
| **Klant** (KBC Mobile) | App in de stijl van KBC Mobile (menubalk Start · Mijn KBC · Beleggen · Zakelijk · Aanbod) met de nieuwe knop **MyLoop**, Kate-tips in "Voor jou" op basis van verrichtingen, KBC Loop bij Extra diensten en in Aanbod, KBC Loop met categorieën en partners, kopen vs. lenen, Mijn KBC met levenscyclus, defect melden → herstel, inleveren → nieuw leven, Kate Coins |
| **Philips** (partnerweergave) | Actieve contracten, terugkerende omzet, voorspelde defecten via sensoren, live herstelaanvragen |
| **KBC** (interne weergave) | Loop-klanten, gefinancierd volume, terugkerende marge, CO₂-impact, triple win |

Persona's: **Lotte** (leent al Philips-lampen, gsm net hersteld), **Jonas** (nieuw huis met KBC-woonkrediet
→ startpakket), **Bakkerij Peeters** (kmo, energiefactuur verdubbeld → Light as a Service).

Presentatiepaneel: knop **"Speel demo af"** speelt de volledige flow automatisch af (± 45 s, ideaal om op
te nemen voor de slides). **"Lamp meldt slijtage"** simuleert een IoT-melding: Philips vervangt de lamp
voor ze uitvalt. De **privacytoggle** toont dat er zonder toestemming geen voorstellen op basis van
verrichtingen komen.

## Gebouwd op bestaande KBC-diensten

KBC Loop hergebruikt 23 diensten uit de KBC-ecosysteemlijst (`shared/src/data/kbcServices.js`), zichtbaar in de demo:

- **Signaal**: Query income and expenses via Kate, PSD2 Account Information Services, Home loan, Business CO2 insights
- **Voorstel**: Kate, KBC Mobile, KBC Business app
- **Financiering**: B2B Asset Financing (+ Partner Hub), Instalment Loan – Partner Hub (overnemen)
- **Betalen per gebruik**: Machine-to-machine payment solutions (Philips Light as a Service)
- **Verzekering**: Home insurance, Office and building insurance, Bicycle insurance, Online fraud insurance
- **Beloning**: Kate Coins, Joyn loyalty points
- **Impact**: ecoWise, Kube ESG, Energy consumption and saving tips
- **Partners aansluiten**: KBC Partner Hub, KBC Developer Portal, Application status webhooks

In de app: "Gebaseerd op" bij *Waarom zie ik dit?*, het blok *Achter de schermen geregeld door KBC* bij elk
product, *Ook bij KBC* per categorie, ecoWise/Kube ESG in Mijn KBC, en een volledig overzicht in de KBC-weergave.

## Architectuur

Drie interfaces, één api en één database. Wat je in de app doet, verschijnt meteen (via WebSocket) in de
dashboards op de web, en omgekeerd: ook tussen verschillende toestellen.

```
  ┌───────────────────────────┐   ┌──────────────────────────────────────┐
  │ web  (Vite + React)       │   │ app  (Expo / React Native)           │
  │  index.html  KBC-apps-    │   │  iOS + Android (Expo Go / build)     │
  │   pagina, presentatie,    │   │  web-versie onder /app/              │
  │   Philips- en KBC-dash-   │   │  (ook als iframe in de web,          │
  │   boards                  │   │   perspectief Klant)                 │
  │  kbc.html    KBC Loop     │   │                                      │
  │   Insights (intern)       │   │                                      │
  └─────────────┬─────────────┘   └──────────────────┬───────────────────┘
                │  REST (GET state, POST acties)     │
                │  WebSocket /api/live (live state)  │
                └─────────────────┬──────────────────┘
                                  ▼
                ┌──────────────────────────────────────┐
                │ api  (Node, http + ws)               │
                │  reducer uit shared → past acties toe│
                │  serveert in productie ook web + app │
                └─────────────────┬────────────────────┘
                                  ▼
                       SQLite (node:sqlite)
                  loop_state  +  action_log

  shared/  data, engine, reducer en api-client: gebruikt door web, app én api
```

## Opbouw

```
kbc-loop/
  package.json     npm-workspaces (shared, api, web, app) + scripts dev/test/build
  Dockerfile       productie-image: bouwt web + app, draait de api (Cloud Run)
  shared/          @kbc-loop/shared: pure JavaScript, zonder React
    src/config/      demo-instellingen (datum, CO₂-factor, Kate Coins, bundelkorting, KBC-marge)
    src/data/        enkel data: categories, partners, products (+ bundels), customers, repairIssues,
                     pilotStats, spendSegments, kbcServices
    src/engine/      logica: rules, signals, catalog, pricing, impact, dashboards, insights, kateIntents …
    src/state/       loopReducer.js (alle acties, puur en getest), actions.js, derive.js
    src/client.js    api-client (fetch + WebSocket) voor web en app
    tests/
  api/             @kbc-loop/api: REST + WebSocket op SQLite
    src/             index.js (start), server.js (routes), db.js, live.js, security.js, static.js, config.js
    tests/
  web/             @kbc-loop/web: Vite + React
    index.html       KBC-appspagina + presentatiepaneel en dashboards (code in src/demo/)
    kbc.html         KBC Loop Insights, intern (code in src/kbc/)
    src/             api.js, state/useLoop.js, components/, hooks/, styles/, assets/
  app/             @kbc-loop/app: Expo-app (iOS, Android en web)
    App.js           start van de app
    src/screens/     schermen (Start, KBC Loop, product, kopen vs. lenen, Mijn KBC, herstel …)
    src/phone/       KBC Mobile-kader: AppBar, TabBar (menubalk), Fab (knop MyLoop)
    src/ui/          gedeelde bouwstenen: Icon, Button, Stat, Photo, KateAvatar, KbcLogo …
    src/             api.js (api-adres + client), useLoop.js, navigation.js, theme.js
    app.json         Expo-config (web onder basis-pad /app)
  scripts/         check-readme.mjs: controleert of deze README de echte opbouw beschrijft
```

**Uitbreiden:** een partner toevoegen = `shared/src/data/partners.js` + producten in
`shared/src/data/products.js`. Een categorie = `shared/src/data/categories.js`. Een signaal = een regel in
`shared/src/engine/rules.js`.

**KBC Loop Insights** (`kbc.html`): interne tool voor KBC-medewerkers. Toont geanonimiseerd welke producten
klanten vaak kopen of laten herstellen (bv. betalingen aan fietsenmakers of gsm-herstellers), wat dat per
jaar kost en welk huurproduct je die groep kan aanbieden. Groepen onder 100 klanten worden niet getoond.
Met *Start campagne via Kate* verschijnt de campagne live in het KBC-dashboard van de web.

## Starten (ontwikkeling)

Vereist Node 22.13 of nieuwer (voor de ingebouwde `node:sqlite`).

```bash
cd kbc-loop
npm install          # alle workspaces in één keer
npm run dev          # api + web + app samen (concurrently)
```

Of apart, elk in een eigen terminal:

```bash
npm run dev:api      # api op http://127.0.0.1:4000 (database: api/data/kbc-loop.db)
npm run dev:web      # web op http://localhost:5173 · intern: http://localhost:5173/kbc.html
npm run dev:app      # Expo-devserver op poort 8081 (QR-code voor Expo Go, w = web, i = iOS, a = Android)
```

De web zoekt de api in ontwikkeling op poort 4000 van dezelfde computer, en de app (voor de iframe in het
perspectief *Klant*) op poort 8081. Andere adressen: `VITE_API_URL` en `VITE_APP_URL`.

### De app op een iPhone of Android-gsm (Expo Go)

1. Installeer **Expo Go** op de gsm. Gsm en computer moeten op **hetzelfde wifi** zitten.
2. Laat de api luisteren op het netwerk, met een sleutel:
   ```bash
   HOST=0.0.0.0 API_KEY=kies-een-lange-willekeurige-sleutel npm run dev:api
   ```
3. Start de app met dezelfde sleutel en scan de QR-code met de camera (iPhone) of in Expo Go (Android):
   ```bash
   EXPO_PUBLIC_API_KEY=kies-een-lange-willekeurige-sleutel npm run dev:app
   ```
   De app vindt het api-adres zelf: hetzelfde ip-adres als de Expo-devserver, poort 4000. Lukt dat niet
   (bv. via `--tunnel`), zet dan `EXPO_PUBLIC_API_URL=http://<ip-van-je-computer>:4000`.
4. Gebruik je de sleutel ook voor de web, zet dan `VITE_API_KEY` op dezelfde waarde voor `npm run dev:web`.

Onversleutelde `http` naar je laptop wordt enkel in ontwikkelmodus toegelaten; een productiebuild van web of
app weigert alles behalve `https`/`wss` (behalve `localhost`).

### Simulators

- **iOS-simulator** (macOS met Xcode): `npm run dev:app` en druk `i`. De simulator bereikt de api via `localhost:4000`.
- **Android-emulator** (Android Studio): `npm run dev:app` en druk `a`. De app gebruikt het adres van de
  devserver, of `10.0.2.2:4000` (de computer achter de emulator).
- **Web**: druk `w`, of open http://localhost:8081.

## Tests

```bash
npm test             # shared (signalen, catalogus, prijzen, impact, reducer, insights) + api (routes, beveiliging)
```

Gebruikt de ingebouwde testrunner van Node (`node --test`), zonder extra pakketten. `npm run lint` controleert
de code van de web (ESLint), `npm run build` maakt de productiebuild van de web in `web/dist/`.

## Documentatie up-to-date houden

```bash
npm run check:readme # draait ook automatisch als laatste stap van npm test
```

`scripts/check-readme.mjs` controleert of deze README nog klopt met de code: elke workspace-map, elke
submap van `shared/src`, `api/src`, `web/src` en `app/src`, elk bestand in `api/src`, elk npm-script uit
`package.json` en elk api-pad uit `api/src/server.js` en `api/src/live.js` moet hier vermeld staan. Ontbreekt
er iets, dan toont het script een lijst en faalt `npm test`. Voeg je een map, script of api-pad toe, vul dan
het blok *Opbouw*, de scripts of de api-tabel hierboven aan.

## API

| Methode | Pad | Wat |
|---|---|---|
| `GET` | `/api/health` | Status `{ ok: true }` (zonder sleutel, voor healthchecks) |
| `GET` | `/api/state` | Volledige demo-state `{ version, state }` |
| `POST` | `/api/actions` | Actie `{ type, ... }` toepassen (enkel gekende actietypes), geeft de nieuwe state terug |
| `GET` | `/api/actions/recent?limit=20` | Laatste acties uit het logboek (max. 100) |
| `GET` | `/api/insights?kind=&customerType=` | Geanonimiseerde groepen + aanbevelingen voor KBC Loop Insights (`kind`: alle/herstelling/herhaalaankoop, `customerType`: alle/particulier/kmo) |
| `WS` | `/api/live` | Subprotocol `kbc-loop`; stuurt `{ type: 'state', version, state }` bij verbinden en bij elke wijziging. Enkel lezen. |

Instellingen van de api (omgevingsvariabelen, zie `api/src/config.js`):

| Variabele | Standaard | Betekenis |
|---|---|---|
| `PORT` | `4000` | Poort |
| `HOST` | `127.0.0.1` | `0.0.0.0` om een gsm op hetzelfde wifi toe te laten |
| `DB_PATH` | `api/data/kbc-loop.db` | SQLite-bestand |
| `STATIC_DIR` | – | Map met de gebouwde web (+ `app/`) om mee te serveren (productie) |
| `ALLOWED_ORIGINS` | lokale dev-servers (5173, 8081) | Komma-lijst van websites die de api mogen aanspreken |
| `API_KEY` | – | Optionele sleutel, verplicht op alle api-verzoeken behalve `/api/health` |
| `TRUST_PROXY` | – | `true` achter een HTTPS-proxy (Cloud Run) |
| `PROXY_HOPS` | `1` | aantal vertrouwde proxy's vóór de api; bepaalt welk `x-forwarded-for`-adres telt voor rate limiting |
| `NODE_ENV` | – | `production` zet HSTS aan |

## Beveiliging

- **Geen `*` in CORS**: enkel de eigen origin en de websites in `ALLOWED_ORIGINS` mogen de api aanspreken
  (ook voor de WebSocket). Andere origins krijgen `403`. Open je de web via het ip-adres van je laptop, voeg
  dat adres dan toe aan `ALLOWED_ORIGINS`.
- **Optionele api-sleutel** (`API_KEY`): via de header `Authorization: Bearer <sleutel>`, of voor de
  WebSocket als subprotocol `key.<sleutel>`. Vergelijking in constante tijd. Aanbevolen zodra de api op een
  netwerk staat; de api waarschuwt bij het starten als dat niet zo is.
- **Rate limiting** per ip-adres: 60 schrijfacties en 600 leesverzoeken per minuut.
- **Invoercontrole en limieten**: enkel gekende actietypes, enkel `application/json`, body max. 16 kB,
  filters tegen een vaste lijst, WebSocket-berichten max. 1 kB (en clients mogen niet schrijven via de
  socket), time-outs op verzoeken. Interne fouten tonen geen details.
- **Beveiligingsheaders** op elke pagina: Content-Security-Policy (`script-src 'self'`, `frame-ancestors 'self'`,
  `object-src 'none'` …), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: no-referrer`, Permissions-Policy, Cross-Origin-Opener-Policy en, in productie, **HSTS**.
  De statische server laat geen bestanden buiten `STATIC_DIR` toe.
- **Enkel https buiten localhost**: de gedeelde api-client weigert `http`/`ws` naar andere adressen, behalve in
  ontwikkelmodus.
- **Container**: draait als niet-root gebruiker `node`, code is alleen-lezen, enkel `/data` is schrijfbaar,
  npm zit niet in het runtime-image.
- **Geen secrets in de repo**: `.env`-bestanden en databases staan in `.gitignore` en `.dockerignore`.
  Let op: `EXPO_PUBLIC_*`- en `VITE_*`-variabelen komen leesbaar in de app- of web-bundel terecht en zijn dus
  **geen geheimen**. `EXPO_PUBLIC_API_KEY`/`VITE_API_KEY` schermen de api enkel af tegen toevallige verzoeken.
- **npm install-scripts staan uit**: npm 12 voert standaard geen install-scripts van pakketten uit, en de
  Dockerfile installeert met `npm ci --ignore-scripts` exact volgens `package-lock.json`.

## Online zetten (Google Cloud Run)

De `Dockerfile` bouwt de web (`web/dist`) en de web-versie van de app (`web/dist/app`) en levert een klein
image waarin enkel de api draait. De api serveert de web op `/`, Insights op `/kbc.html` en de app op `/app/`:
alles op één HTTPS-adres, dus geen extra CORS nodig.

```bash
cd kbc-loop
gcloud run deploy kbc-loop --source . --region europe-west1 --max-instances 1
# Geen API_KEY nodig: web en app draaien op hetzelfde adres. Zet je toch API_KEY, dan moeten
# VITE_API_KEY/EXPO_PUBLIC_API_KEY bij het bouwen dezelfde waarde krijgen (de Dockerfile doet dat niet).
```

Lokaal testen: `docker build -t kbc-loop . && docker run --rm -p 8080:8080 kbc-loop` en open http://localhost:8080.

- **SQLite op Cloud Run is tijdelijk**: elke instantie heeft haar eigen database, die verdwijnt bij een
  herstart of nieuwe versie. Voor de demo volstaat `--max-instances 1` (één gedeelde state). Voor echt
  gebruik: een gekoppeld volume voor `/data`, of een echte database (bv. Cloud SQL).
- **Niet publiek zonder toestemming van KBC**: de webweergave bootst kbc.be na (screenshot, KBC-logo). Zet de
  dienst niet openbaar online zonder toestemming van KBC; laat `--allow-unauthenticated` weg en gebruik
  bv. IAM of Identity-Aware Proxy, of deel enkel met de jury.

## Onaf / disclaimers

- Conceptprototype, geen officiële KBC-app of -website. De webweergave bootst de KBC-appspagina na, met het
  KBC-logo, de hero-foto en de app-iconen uit een screenshot (`web/src/assets/site/`). Het KBC-logo wordt
  ook in de app en de presentatie gebruikt. Enkel bedoeld voor de hackathonpresentatie; niet publiek online
  zetten zonder toestemming van KBC. De klantenapp bootst de stijl van KBC Mobile na met eigen iconen;
  logo's van andere merken zijn niet overgenomen.
- Klanten, rekeningen en bedragen zijn fictief en indicatief. Philips (Signify) is een voorbeeldpartner,
  geen bestaande samenwerking; alle andere partners zijn fictief.
- Geen echte bank-API's: data staat in `shared/src/data/`. Volgende stap: PSD2/transactiedata, KBC Partner Hub,
  B2B Asset Financing en M2M-betalingen voor pay-per-use.
- Signaaldetectie is regelgebaseerd en uitlegbaar; Kate herkent vragen met trefwoorden.
- Geen API-keys of secrets in deze repo.
