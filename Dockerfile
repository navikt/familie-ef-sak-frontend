FROM cgr.dev/chainguard/node:18

WORKDIR /var/server

ADD ./ .

EXPOSE 8000
CMD ["npm", "run", "start"]
