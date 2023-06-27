FROM ghcr.io/navikt/baseimages/node-express:18

ADD ./ /var/server/

EXPOSE 8000
CMD ["yarn", "start"]
