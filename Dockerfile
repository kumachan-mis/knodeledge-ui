FROM node:22.17-alpine AS builder

ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT \
  NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

WORKDIR /app

COPY ./.yarnrc.standalone.yml    ./.yarnrc.yml
COPY ./.yarn/releases            ./.yarn/releases
COPY ./yarn.lock                 ./yarn.lock
COPY ./package.json              ./package.json
COPY ./tsconfig.json             ./tsconfig.json
COPY ./next.standalone.config.js ./next.config.js
COPY ./src                       ./src

RUN yarn install && \
  yarn build


FROM node:22.17-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.js   ./next.config.js
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static     ./.next/standalone/.next/static

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001 &&  \
  chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

CMD ["node", "/app/.next/standalone/server.js"]
