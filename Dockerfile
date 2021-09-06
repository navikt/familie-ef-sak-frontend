FROM navikt/node-express:12.2.0-alpine

ADD ./package.json /var/server
ADD ./backend_production /var/server/backend_production
ADD ./frontend_production /var/server/frontend_production

EXPOSE 8000
CMD ["yarn", "start"]