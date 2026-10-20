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
| **Klant** (KBC Mobile) | Kate-inzichten op basis van verrichtingen, KBC Loop met categorieën en partners, kopen vs. lenen, Mijn KBC met levenscyclus, defect melden → herstel, inleveren → nieuw leven, Kate Coins |
| **Philips** (partnerweergave) | Actieve contracten, terugkerende omzet, voorspelde defecten via sensoren, live herstelaanvragen |
| **KBC** (interne weergave) | Loop-klanten, gefinancierd volume, terugkerende marge, CO₂-impact, triple win |

Persona's: **Lotte** (leent al Philips-lampen, gsm net hersteld), **Jonas** (nieuw huis met KBC-woonkrediet
→ startpakket), **Bakkerij Peeters** (kmo, energiefactuur verdubbeld → Light as a Service).

Presentatiepaneel: knop **"Speel demo af"** speelt de volledige flow automatisch af (± 45 s, ideaal om op
te nemen voor de slides). **"Lamp meldt slijtage"** simuleert een IoT-melding: Philips vervangt de lamp
voor ze uitvalt. De **privacytoggle** toont dat er zonder toestemming geen voorstellen op basis van
verrichtingen komen.

## Gebouwd op bestaande KBC-diensten

KBC Loop hergebruikt 23 diensten uit de KBC-ecosysteemlijst (`src/data/kbcServices.js`), zichtbaar in de demo:

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

## Starten

```bash
npm install
npm run dev      # web: http://localhost:5173 · app: /app.html · intern: /kbc.html
npm test         # 27 tests op signalen, prijzen, impact en state (Node 22+, geen extra pakketten)
npm run build    # productiebuild in dist/
```

## Web, app en interne KBC-weergave

De demo bestaat uit drie aparte interfaces op dezelfde backend (`data/`, `engine/`, `state/`):

- **App** (`app.html`, code in `src/app/`): de klantenapp KBC Mobile. Op een gsm schermvullend.
  Enkel KBC Loop is klikbaar (tab *KBC Loop* onderaan, Start en Mijn KBC); de rest van KBC Mobile
  staat lichtgrijs.
- **Web** (`index.html`, code in `src/web/`): presentatiepaneel en de Philips- en KBC-dashboards.
  Ziet eruit als de pagina "Alle apps van KBC": alles is lichtgrijs en niet klikbaar, behalve het
  nieuwe tabblad *KBC Loop* (of `/#loop`). Daar staan het presentatiepaneel, de dashboards en, in het
  perspectief *Klant*, de app in een iframe.

- **KBC Loop Insights** (`kbc.html`, code in `src/kbc/`): interne tool voor KBC-medewerkers. Toont
  geanonimiseerd welke producten klanten vaak kopen of laten herstellen (bv. betalingen aan
  fietsenmakers of gsm-herstellers), wat dat per jaar kost en welk huurproduct je die groep kan
  aanbieden. Groepen onder 100 klanten worden niet getoond. Met *Start campagne via Kate* verschijnt
  de campagne live in het KBC-dashboard van de web. Data: `data/spendSegments.js`, logica: `engine/insights.js`.

Alle drie delen dezelfde state via `localStorage`: wat je in de app doet, verschijnt meteen in de
dashboards (in dezelfde browser, ook in een ander tabblad).

## Opbouw (modulair)

```
src/
  app/           klantenapp: MobileApp.jsx, main.jsx, phone/ (PhoneFrame, AppBar, TabBar), screens/
  web/           webweergave: WebApp.jsx, main.jsx, site/, dashboards/, presenter/
  kbc/           interne KBC-weergave: InsightsApp.jsx (KBC Loop Insights)
  config/        demo-instellingen (datum, CO₂-factor, Kate Coins, bundelkorting, KBC-marge)
  data/          enkel data: categories, partners, products (+ bundels), customers, repairIssues, pilotStats
  engine/        pure logica zonder React, getest in tests/
    rules.js       signaalregels (nieuwe regel = één object toevoegen)
    signals.js     regels → Kate-inzichten, respecteert toestemming en weggeklikte voorstellen
    catalog.js     producten, bundels, partners, categorieën per klanttype
    pricing.js     kopen vs. lenen over de looptijd
    impact.js      CO₂, km-equivalent, herstellingen
    dashboards.js  cijfers voor partner- en KBC-weergave (pilotbasis + live demo)
    kateIntents.js eenvoudige herkenning van vragen aan Kate
  state/         loopReducer.js (alle acties, puur en getest), useLoop.js (hook + sync), actions.js
  hooks/         useAutoplay.js (presentatiemodus)
  components/ui/ gedeelde UI (Icon, Photo, Stat, KateAvatar)
  styles/        tokens, layout, phone, screens, dashboard
```

**Uitbreiden:** een partner toevoegen = `data/partners.js` + producten in `data/products.js`.
Een categorie = `data/categories.js`. Een signaal = een regel in `engine/rules.js`.

## Foto's

Zet foto's in `public/img/categories/` (namen staan in `LEESMIJ.txt` in die map). Zonder foto toont
de app automatisch een illustratie in de kleuren van de categorie.

## Online zetten (Google Cloud Run)

```bash
gcloud run deploy kbc-loop --source . --region europe-west1 --allow-unauthenticated
```

De container draait als niet-root gebruiker (nginx-unprivileged) en zet beveiligingsheaders
(CSP, X-Frame-Options, HSTS …), zie `nginx.conf`.

## Onaf / disclaimers

- Conceptprototype, geen officiële KBC-app. Geen KBC-logo of Kate-icoon gebruikt.
- Klanten, rekeningen en bedragen zijn fictief en indicatief. Philips (Signify) is een voorbeeldpartner,
  geen bestaande samenwerking; alle andere partners zijn fictief.
- Geen echte bank-API's: data staat in `src/data/`. Volgende stap: PSD2/transactiedata, KBC Partner Hub,
  B2B Asset Financing en M2M-betalingen voor pay-per-use.
- Signaaldetectie is regelgebaseerd en uitlegbaar; Kate herkent vragen met trefwoorden.
- Geen API-keys of secrets in deze repo.
- Bekend: Vite 5 heeft een gemelde kwetsbaarheid in de dev-server (esbuild). Die raakt enkel `npm run dev`,
  niet de productiebuild; oplossen door Vite te upgraden.
