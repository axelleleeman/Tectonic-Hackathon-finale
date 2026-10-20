# syntax=docker/dockerfile:1
#
# KBC Loop: one container with the api (REST + WebSocket + SQLite) that also serves the built web,
# KBC Loop Insights (/kbc/) and the web version of the app (/app/). Build from kbc-loop/:
#   docker build -t kbc-loop .
#   docker run --rm -p 8080:8080 kbc-loop
# or: docker compose up --build (see docker-compose.yml: volume for /data, healthcheck)
#
# Node 24 (LTS): node:sqlite works without a flag from Node 22.13 / 23.4.
ARG NODE_IMAGE=node:24-alpine

# ---- 1. Install all workspaces (exactly per package-lock.json, without install scripts) ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /src
ENV npm_config_ignore_scripts=true \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/web-ui/package.json packages/web-ui/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/insights/package.json apps/insights/
COPY apps/app/package.json apps/app/
RUN npm ci --ignore-scripts

# ---- 2. Build the web (apps/web/dist), then KBC Loop Insights (dist/kbc) and the app as web (dist/app) ----
FROM deps AS build
ENV CI=1 \
    EXPO_NO_TELEMETRY=1
COPY packages packages
COPY apps/web apps/web
COPY apps/insights apps/insights
COPY apps/app apps/app
# Web first: vite empties apps/web/dist. Insights and the app then go into subfolders.
RUN npm run build -w @kbc-loop/web \
 && npm run build -w @kbc-loop/insights \
 && npm run export:web -w @kbc-loop/app \
 && test -f apps/web/dist/index.html -a -f apps/web/dist/kbc/index.html -a -f apps/web/dist/app/index.html

# ---- 3. Only the api's production dependencies (ws + link to shared) ----
FROM ${NODE_IMAGE} AS api-deps
WORKDIR /srv/kbc-loop
ENV npm_config_ignore_scripts=true \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/web-ui/package.json packages/web-ui/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/insights/package.json apps/insights/
COPY apps/app/package.json apps/app/
RUN npm ci --omit=dev --ignore-scripts -w @kbc-loop/api

# ---- 4. Runtime: small, non-root, only api + shared + built files ----
FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production \
    TRUST_PROXY=true \
    HOST=0.0.0.0 \
    PORT=8080 \
    STATIC_DIR=/srv/public \
    DB_PATH=/data/kbc-loop.db

# npm/yarn are not needed at runtime: remove them (smaller attack surface).
# /data is the only writable folder, owned by the user node.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
           /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn* \
 && mkdir -p /data && chown node:node /data && chmod 700 /data

WORKDIR /srv/kbc-loop
# Code stays owned by root (read-only for node)
COPY --from=api-deps /srv/kbc-loop/node_modules ./node_modules
COPY package.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/shared/src packages/shared/src
COPY apps/api/package.json apps/api/
COPY apps/api/src apps/api/src
COPY --from=build /src/apps/web/dist /srv/public

# Non-root with a numeric UID:GID (= user node in the official image), so scanners and
# Kubernetes (runAsNonRoot) can verify it is not root. The code stays owned by root.
USER 1000:1000
EXPOSE 8080
VOLUME ["/data"]
# Liveness probe; the api shuts down gracefully on SIGTERM (docker stop).
STOPSIGNAL SIGTERM
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/api/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

CMD ["node", "apps/api/src/index.js"]
