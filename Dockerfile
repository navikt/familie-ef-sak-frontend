FROM gcr.io/distroless/nodejs20-debian12

ENV NODE_ENV production
WORKDIR /var/server

COPY assets ./assets
COPY node_modules ./node_modules
COPY build_n_deploy ./build_n_deploy
COPY node_dist ./node_dist
COPY frontend_production ./frontend_production
COPY package.json .


EXPOSE 8000
CMD ["--es-module-specifier-resolution=node", "node_dist/backend/server.js"]
