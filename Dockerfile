FROM navikt/node-express:12.2.0-alpine

ADD ./backend_production /var/server/backend_production
ADD ./frontend_production /var/server/frontend_production

ENV NODE_ENV production

EXPOSE 8000
CMD ["node", "backend_production/backend/server.js"]