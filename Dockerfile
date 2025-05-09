FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY assets ./assets
COPY node_modules ./node_modules
COPY build_n_deploy ./build_n_deploy
COPY node_dist ./node_dist
COPY frontend_production ./frontend_production
COPY package.json .

ENV NODE_ENV production

EXPOSE 8001
CMD ["--import=./node_dist/backend/register.js", "--es-module-specifier-resolution=node", "node_dist/backend/server.js"]