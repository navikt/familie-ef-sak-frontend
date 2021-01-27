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

app.get('/familie-ef-sak/api/personopplysninger/behandling/12345678910', (req, res) => {
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

app.get('/familie-ef-sak/api/vurdering/:id/inngangsvilkar', (req, res) => {
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
    setTimeout(() => res.send(lesMockFil(`oppgave.json`)), delayMs);
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

module.exports = app;
