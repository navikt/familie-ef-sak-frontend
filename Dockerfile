FROM node:18-alpine as builder

WORKDIR /app

COPY .npmrc
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

FROM gcr.io/distroless/nodejs:18

WORKDIR /var/server

COPY --from=builder /app/assets ./assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build_n_deploy ./build_n_deploy
COPY --from=builder /app/node_dist ./node_dist
COPY --from=builder /app/frontend_production ./frontend_production
COPY --from=builder /app/package.json .

ENV NODE_ENV production

EXPOSE 8000

CMD ["--es-module-specifier-resolution=node", "node_dist/backend/server.js"]