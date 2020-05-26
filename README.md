# familie-ef-sak-frontend
====================

Frontend app for enslig forsørger saksbehandling (overgangsstønad)

# Kom i gang med utvikling

* Installere avhengigheter `yarn`
* Starte dev-server `yarn start:dev`
* Starte mock-server `yarn start:mock`
* Åpne `http://localhost:8000` i nettleseren din

Appen krever en del environment variabler og legges til i .env fila i root på prosjektet.  
```

    COOKIE_KEY1='<any string of length 32>'
    COOKIE_KEY2='<any string of length 32>'
    PASSPORTCOOKIE_KEY1='<any string of length 32>'
    PASSPORTCOOKIE_KEY2='<any string of length 32>'
    PASSPORTCOOKIE_KEY3='<any string of length 12>'
    PASSPORTCOOKIE_KEY4='<any string of length 12>'
    SESSION_SECRET='<any string of length 32>'

    CLIENT_ID='<>'
    CLIENT_SECRET='<>'
    
    ENV=local
    APP_VERSION=0.0.1
```
Disse kan hentes ut fra Secrets i Vault under kv/preprod/fss/familie-ef-sak-frontend/default, med unntak av ENV og APP_VERSION som er gitt over.

CLIENT_ID og CLIENT_SECRET kan man finne under: /azuread/data/dev/creds/familie-ef-sak-frontend 


For å bygge prodversjon kjør `yarn build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

---


# Bygg og deploy
Appen bygges på github actions, og gir beskjed til nais deploy om å deployere appen i fss området. Alle pull requester går til dev miljøet og master går til produksjon og dev-miljøet.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes til:

* Mattis Janitz, `mattis.janitz@nav.no`

Prosjektet er laget med utgangspunkt i familie-ba-sak-frotend 

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.
