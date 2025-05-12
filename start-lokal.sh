#!/bin/bash

# Henter secrets og setter .env filen. Oasis og Wonderwall trenger disse for lokalkjøring.
./hent-og-lagre-miljøvariabler.sh


# Starter Docker container med Wonderwall config - se wonderwall-docker-compose-lokal.yml
docker-compose -f wonderwall-docker-compose-lokal.yml up -d

# Starter frontend mot preprod - se package.json for yarn start:dev
yarn start:dev
