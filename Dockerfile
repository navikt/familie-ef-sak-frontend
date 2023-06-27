FROM cgr.dev/chainguard/node:18

WORKDIR /var/server

ADD assets ./assets
ADD node_modules ./node_modules
ADD node_dist ./node_dist
ADD frontend_production ./frontend_production
ADD package.json .

EXPOSE 8000
CMD ["/usr/bin/npm", "run", "start"]
