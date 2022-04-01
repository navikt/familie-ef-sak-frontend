# familie-ef-sak-frontend


Frontend app for enslig forsørger saksbehandling (overgangsstønad)

# Kom i gang med utvikling

* Installere avhengigheter `yarn`
* Starte dev-server `yarn start:dev`
* Starte mock-server `yarn start:mock`
* Åpne `http://localhost:8000` i nettleseren din

For å kunne installere avhengigheter fra navikt registry må man være logget inn i github packages. Kjør kommando: 
`npm login --scope=@navikt --registry=https://npm.pkg.github.com`
username er det samme på github og passordet er utvikler-tokenet som er generert i github.
Dersom tokenet allerede er generert, finnes det typisk i m2-settings/gradle.properties fil.

## Client id & client secret
secret kan hentes fra cluster med 
`kubectl -n teamfamilie get secret azuread-familie-ef-sak-frontend-lokal -o json | jq '.data | map_values(@base64d)'`
`kubectl -n teamfamilie get secret azuread-familie-ef-sak-lokal -o json | jq '.data | map_values(@base64d)'`


Appen krever en del environment variabler og legges til i .env fila i root på prosjektet.  
```
    ENV=local
    APP_VERSION=0.0.1
    COOKIE_KEY1='<any string of length 32>'
    COOKIE_KEY2='<any string of length 32>'
    PASSPORTCOOKIE_KEY1='<any string of length 32>'
    PASSPORTCOOKIE_KEY2='<any string of length 32>'
    PASSPORTCOOKIE_KEY3='<any string of length 12>'
    PASSPORTCOOKIE_KEY4='<any string of length 12>'
    SESSION_SECRET='<any string of length 32>'

    EF_SAK_SCOPE='api://<AZURE_APP_CLIENT_ID fra secret til azuread-familie-ef-sak-lokal>/.default'
    CLIENT_ID='<AZURE_APP_CLIENT_ID fra secret>'
    CLIENT_SECRET='<AZURE_APP_CLIENT_SECRET fra secret>'
    AZURE_APP_WELL_KNOWN_URL='<AZURE_APP_WELL_KNOWN_URL fra secret>'
    
```


For å bygge prodversjon kjør `yarn build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.


---------

# Mens du koder

I Team Familie har vi et intern (felles frontend bibliotek)[https://github.com/navikt/familie-felles-frontend] for komponenter som kan brukes på tvers av appene våre. Lager man noe som kan senere gjenbrukes, er det fint om disse trekkes ut hit.

Ta gjerne en titt på Team Familie sin (readme)[https://github.com/navikt/familie] med best practices når det kommer til frontendutvikling, uu og bruken av styled-components! 



---


# Bygg og deploy
Appen bygges på github actions, og gir beskjed til nais deploy om å deployere appen i fss området. Alle pull requester går til dev miljøet og master går til produksjon og dev-miljøet.


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes til:

* Mattis Janitz, `mattis.janitz@nav.no`

Prosjektet er laget med utgangspunkt i familie-ba-sak-frotend 

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.
