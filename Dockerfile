FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY assets ./assets
COPY node_modules ./node_modules
COPY .nais ./.nais
COPY dist ./dist
COPY package.json .

ENV NODE_ENV production

EXPOSE 8000
CMD ["--es-module-specifier-resolution=node", "dist/server/server.js"]