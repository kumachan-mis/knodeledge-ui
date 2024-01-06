FROM node:20.10-alpine AS builder

WORKDIR /app

COPY ./.yarnrc.yml    ./.yarnrc.yml
COPY ./.yarn          ./.yarn
COPY ./.pnp.cjs       ./.pnp.cjs
COPY ./yarn.lock      ./yarn.lock
COPY ./package.json   ./package.json
COPY ./tsconfig.json  ./tsconfig.json
COPY ./next.config.js ./next.config.js
COPY ./src            ./src

RUN yarn install && yarn build


FROM node:20.10-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/.yarnrc.yml    ./.yarnrc.yml
COPY --from=builder /app/.yarn          ./.yarn
COPY --from=builder /app/.pnp.cjs       ./.pnp.cjs
COPY --from=builder /app/yarn.lock      ./yarn.lock
COPY --from=builder /app/package.json   ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.next          ./.next

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
