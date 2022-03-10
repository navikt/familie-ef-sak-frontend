FROM navikt/node-express:16

ADD ./ /var/server/

EXPOSE 8000
CMD ["yarn", "start"]