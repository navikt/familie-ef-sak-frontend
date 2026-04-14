# familie-ef-sak-frontend

Frontend app for enslig forsørger saksbehandling (overgangsstønad)

# Kom i gang med utvikling

- Installere avhengigheter `npm ci`
- Starte dev-server `npm run dev`
- Åpne `http://localhost:8000` i nettleseren din

For å kunne installere avhengigheter fra navikt registry må man være logget inn i github packages. Kjør kommando:
`npm login --scope=@navikt --registry=https://npm.pkg.github.com`
username er det samme på github og passordet er utvikler-tokenet som er generert i github.
Dersom tokenet allerede er generert, finnes det typisk i m2-settings/gradle.properties fil.

## Miljøvariabler for lokal utvikling

Appen krever en del environment variabler og legges til i .env fila i root på prosjektet

Secrets kan bli lagt inn automatisk dersom man kjører `sh hent-og-lagre-miljøvariabler.sh`. Scriptet krever at du har
`jq`, er pålogget naisdevice og er logget inn på google `gcloud auth login`)

Secrets kan også hentes selv fra cluster med
`kubectl -n teamfamilie get secret azuread-familie-ef-sak-frontend-lokal -o json | jq '.data | map_values(@base64d)'`
`kubectl -n teamfamilie get secret azuread-familie-ef-sak-lokal -o json | jq '.data | map_values(@base64d)'`

Dersom det skal kjøres mot backend lokalt må følgende være satt:

```
ENV=local
EF_SAK_SCOPE=api://dev-gcp.teamfamilie.familie-ef-sak-lokal/.default
```

Dersom det skal kjøres mot preprod må følgende være satt:

```
ENV=lokalt-mot-preprod
EF_SAK_SCOPE=api://dev-gcp.teamfamilie.familie-ef-sak/.default
```

For å bygge prodversjon kjør `npm run build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i
forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

## Installere @navikt-pakker lokalt

For å installere @navikt-scopede pakker må du autentisere deg med et PAT.

1. Opprett et Personal Access Token. Token genererer du under developer settings på Github. Den trenger kun read:
   packages. Husk å enable SSO for navikt-orgen.
2. Skriv `npm login --scope=@navikt --registry=https://npm.pkg.github.com` i terminalen (obs, windows-syntaksen er litt
   annerledes - mellomrom heller enn =)
3. Skriv inn github-brukernavnet ditt. Passordet er tokenet fra github

## Testing

Appen benytter [vitest](https://vitest.dev/) til enhetstesting. Legg gjerne til nye tester etter oppdateringer av appen.
For å kjøre opp tester lokalt kan man kjøre `npm run test`. For å kjøre opp testene i interaktiv modus kan man kjøre
`vitest`.

# Bygg og deploy

Appen bygges på github actions, og deployes til gcp. Merge til main vil deploye app til produksjon og dev.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.
