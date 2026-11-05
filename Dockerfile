# Static portfolio. The image is published only by the manual GHCR workflow.
# No Compose, Swarm, or Traefik configuration lives here.

FROM node:24.22.2-bookworm-slim AS build

WORKDIR /src

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable && corepack prepare pnpm@12.15.0 --activate

# nuxt prepare runs on install, so the source has to be present first.
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:1.30.6-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/.output/public /usr/share/nginx/html

EXPOSE 80
