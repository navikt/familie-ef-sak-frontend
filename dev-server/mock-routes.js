const express = require('express');
const path = require('path');
const fs = require('fs');

const delayMs = 500;
const app = express();
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const lesMockFil = (filnavn) => {
    try {
        return fs.readFileSync(path.join(__dirname, '/mock/' + filnavn), 'UTF-8');
    } catch (err) {
        throw err;
    }
};

app.get('/familie-ef-sak/api/fagsak/1', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`fagsak-1.json`)), delayMs);
});

app.get('/user/profile', (req, res) => {
    res.send({
        displayName: 'James Bond',
        email: 'james@bond.com',
        enhet: '39012',
        navIdent: 'Z007',
    });
});

app.post('/familie-ef-sak/api/sok/', (req, res) => {
    const filnavn = `søkeresultat.json`;
    setTimeout(() => res.send(lesMockFil()), delayMs);
});
app.get('/familie-ef-sak/api/personopplysninger/fagsak/:id', (req, res) => {
    const filnavn = `personopplysninger.json`;
    setTimeout(() => res.send(lesMockFil(filnavn)), delayMs);
});

app.get('/familie-ef-sak/api/personopplysninger/behandling/:id', (req, res) => {
    const filnavn = `personopplysninger.json`;
    setTimeout(() => res.send(lesMockFil(filnavn)), delayMs);
});

app.get('/familie-ef-sak/api/journalpost/:id', (req, res) => {
    const filnavn = `journalforing.json`;
    setTimeout(() => res.send(lesMockFil(filnavn)), delayMs);
});

app.get('/familie-ef-sak/api/vedlegg/:id', (req, res) => {
    const filnavn = `vedleggListe.json`;
    setTimeout(() => res.send(lesMockFil(filnavn)), delayMs);
});

app.get('/familie-ef-sak/api/vurdering/:id/vilkar', (req, res) => {
    const filnavn = `inngangsvilkår-1.json`;
    setTimeout(() => res.send(lesMockFil(filnavn)), delayMs);
});

app.get('/familie-ef-sak/api/journalpost/:id/dokument/:dokumentInfoId', (req, res) => {
    const filnavn = `journalforing-dokument.json`;
    setTimeout(() => res.send(lesMockFil(filnavn)), delayMs);
});

app.get('/familie-ef-sak/api/behandling/2/vedtak-html', (req, res) => {
    setTimeout(
        () =>
            res.send({
                data: lesMockFil(`vedtak.html`),
                status: 'SUKSESS',
            }),
        delayMs
    );
});

app.post('/familie-ef-sak/api/behandling/opprett', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`fagsak-1.json`)), delayMs);
});

app.get('/familie-ef-sak/api/behandling/:id', (req, res) => {
    const behandling = JSON.parse(lesMockFil(`behandling.json`));
    behandling.data.id = req.params.id;
    setTimeout(() => res.send(behandling), delayMs);
});

app.post('/familie-ef-sak/api/fagsak/1/nytt-vedtak', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`fagsak-1.json`)), delayMs);
});

app.post('/familie-ef-sak/api/oppgave/soek', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`hent-oppgave.json`)), delayMs);
});
app.get('/familie-ef-sak/api/oppgave/:id', (req, res) => {
    if (req.params.id === '45058') {
        setTimeout(() => res.send(lesMockFil(`oppgave-finnes-ikke.json`)), delayMs);
    } else {
        setTimeout(() => res.send(lesMockFil(`oppgave-finnes.json`)), delayMs);
    }
});

app.post('/familie-ef-sak/api/blankett/oppgave/:id', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`start-blankett-oppgave.json`)), delayMs);
});

app.post('/familie-ef-sak/api/blankett/:id', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`journalforing-dokument.json`)), delayMs);
});

app.get('/familie-ef-sak/api/blankett/:id', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`journalforing-dokument.json`)), delayMs);
});

app.post('/familie-ef-sak/api/fagsak', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`behandlinger.json`)), delayMs);
});

app.post('/familie-ef-sak/api/journalpost/:journalpostId/fullfor', (req, res) => {
    setTimeout(
        () =>
            res.send({
                status: 'SUKSESS',
                frontendFeilmelding: 'Noe gikk galt. Hjelp!?',
                errorMessage: 'teknisk feil',
            }),
        delayMs
    );
});

app.get('/familie-ef-sak/api/vedtak/:id/totrinnskontroll', (req, res) => {
    const status = [
        'IKKE_AUTORISERT',
        'TOTRINNSKONTROLL_UNDERKJENT',
        'UAKTUELT',
        'KAN_FATTE_VEDTAK',
    ].includes(req.params.id)
        ? req.params.id
        : 'UAKTUELT';
    const lesMockFil1 = lesMockFil(`totrinnskontroll.json`);
    const json = JSON.parse(lesMockFil1);
    json.data.status = status;
    setTimeout(() => res.send(json), delayMs);
});

app.post('/familie-ef-sak/api/vedtak/:id/beslutte-vedtak', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`totrinnskontroll.json`)), delayMs);
});

app.post('/familie-ef-sak/api/vedtak/:id/send-til-beslutter', (req, res) => {
    setTimeout(() => res.status(200).send({ data: req.params.id, status: 'SUKSESS' }), delayMs);
});

app.post('/logg-feil', (req, res) => {
    console.error(req.body.melding);
    res.status(200).send();
});

app.post('/familie-ef-sak/api/oppgave/:oppgaveId/fordel', (req, res) => {
    setTimeout(() => res.send({ data: 45060, status: 'SUKSESS' }), delayMs);
});

app.get('/familie-ef-sak/api/behandlingshistorikk/:behandlingId', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`behandlinghistorikk.json`)), delayMs);
});

app.get('/familie-ef-sak/api/vurdering/regler', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`regler.json`)), delayMs);
});

app.get('/familie-ef-sak/api/soknad/:behandlingId/datoer', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`vedtak-søknad-data.json`)), delayMs);
});

app.post('/familie-ef-sak/api/beregning/:behandlingId/lagre-vedtak', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`lagre-vedtak.json`)), delayMs);
});

app.post('/familie-ef-sak/api/behandling/:behandlingId/annuller', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`behandle-i-gosys.json`)), delayMs);
});

app.get('/familie-ef-sak/api/vedtak/:behandlingId', (req, res) => {
    setTimeout(() => res.send(lesMockFil('vedtak.json')), delayMs);
});

app.get('/familie-ef-sak/api/sok/:behandlingId/samme-adresse', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`søke-person-resultat.json`)), delayMs);
});

app.get('/familie-ef-sak/api/personopplysninger/nav-kontor/behandling/:id', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`nav-kontor.json`)), delayMs);
});

//localhost:8000/familie-brev/api/ef-brev/avansert-dokument/bokmaal/innvilgetOvergangsstonadHoved2/felter
app.get('/familie-brev/api/ef-brev/avansert-dokument/bokmaal/:mal/felter', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`innvilgetOvergangsstønadBrevMal.json`)), delayMs);
});

module.exports = app;
