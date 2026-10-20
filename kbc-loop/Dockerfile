# syntax=docker/dockerfile:1
#
# KBC Loop: één container met de api (REST + WebSocket + SQLite) die ook de gebouwde web
# en de web-versie van de app (/app/) serveert. Bouwen vanuit kbc-loop/:
#   docker build -t kbc-loop .
#   docker run --rm -p 8080:8080 kbc-loop
#
# Node 24 (LTS): node:sqlite werkt zonder vlag vanaf Node 22.13 / 23.4.
ARG NODE_IMAGE=node:24-alpine

# ---- 1. Alle workspaces installeren (exact volgens package-lock.json, zonder install-scripts) ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /src
ENV npm_config_ignore_scripts=true \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY api/package.json api/
COPY web/package.json web/
COPY app/package.json app/
RUN npm ci --ignore-scripts

# ---- 2. Web bouwen (web/dist) en daarna de app als web exporteren (web/dist/app) ----
FROM deps AS build
ENV CI=1 \
    EXPO_NO_TELEMETRY=1
COPY shared shared
COPY web web
COPY app app
# Eerst de web: vite maakt web/dist leeg. Daarna zet Expo de app in web/dist/app.
RUN npm run build -w @kbc-loop/web
RUN npm run export:web -w @kbc-loop/app \
 && test -f web/dist/index.html -a -f web/dist/kbc.html -a -f web/dist/app/index.html

# ---- 3. Enkel de productie-afhankelijkheden van de api (ws + link naar shared) ----
FROM ${NODE_IMAGE} AS api-deps
WORKDIR /srv/kbc-loop
ENV npm_config_ignore_scripts=true \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY api/package.json api/
COPY web/package.json web/
COPY app/package.json app/
RUN npm ci --omit=dev --ignore-scripts -w @kbc-loop/api

# ---- 4. Runtime: klein, niet-root, enkel api + shared + gebouwde bestanden ----
FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production \
    TRUST_PROXY=true \
    HOST=0.0.0.0 \
    PORT=8080 \
    STATIC_DIR=/srv/public \
    DB_PATH=/data/kbc-loop.db

# npm/yarn zijn niet nodig om te draaien: weg ermee (kleiner aanvalsoppervlak).
# /data is de enige schrijfbare map, eigendom van de gebruiker node.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
           /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn* \
 && mkdir -p /data && chown node:node /data && chmod 700 /data

WORKDIR /srv/kbc-loop
# Code blijft eigendom van root (alleen-lezen voor node)
COPY --from=api-deps /srv/kbc-loop/node_modules ./node_modules
COPY package.json ./
COPY shared/package.json shared/
COPY shared/src shared/src
COPY api/package.json api/
COPY api/src api/src
COPY --from=build /src/web/dist /srv/public

USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/api/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

CMD ["node", "api/src/index.js"]
