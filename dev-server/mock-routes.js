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

app.post('/familie-ef-sak/api/personopplysninger', (req, res) => {
    const filnavn =
        req.body['personIdent'] === '12345678910' ? `personinfo.json` : `feil-personinfo.json`;
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

app.post('/familie-ef-sak/api/oppgave/:oppgaveId/fordel', (req, res) => {
    setTimeout(() => res.send({ data: 45060, status: 'SUKSESS' }), delayMs);
});

module.exports = app;
