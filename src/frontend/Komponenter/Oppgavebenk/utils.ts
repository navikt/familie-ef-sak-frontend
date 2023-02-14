import { IOppgave } from './typer/oppgave';
import { IdentGruppe } from '@navikt/familie-typer/dist/oppgave';
import { Handling } from './typer/handling';

const måBehandlesIEFSak = (oppgave: IOppgave) => {
    const { behandlesAvApplikasjon, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'familie-ef-sak' &&
        oppgavetype &&
        ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'].includes(oppgavetype)
    );
};

export const utledetFolkeregisterIdent = (oppgave: IOppgave) =>
    oppgave.identer?.filter((i) => i.gruppe === IdentGruppe.FOLKEREGISTERIDENT)[0].ident ||
    'Ukjent ident';

const oppgaveErTilbakekreving = (oppgave: IOppgave) => {
    return (
        // oppgave.behandlingstema === 'ab0071' && //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver må denne sjekken inkluderes
        oppgave.behandlesAvApplikasjon === 'familie-tilbake' && oppgave.behandlingstype === 'ae0161'
    );
};

const oppgaveErKlage = (oppgave: IOppgave) =>
    oppgave.behandlesAvApplikasjon === 'familie-klage' && oppgave.behandlingstype === 'ae0058';

const oppgaveErJournalførKlage = (oppgave: IOppgave) =>
    oppgave.oppgavetype === 'JFR' && oppgave.behandlingstype === 'ae0058';

const oppgaveErVurderKonsekvensForYtelse = (oppgave: IOppgave) => {
    return oppgave.oppgavetype === 'VUR_KONS_YTE';
};

const kanJournalføres = (oppgave: IOppgave) => oppgave.oppgavetype === 'JFR';

export const utledHandling = (oppgave: IOppgave): Handling => {
    if (måBehandlesIEFSak(oppgave)) {
        return Handling.SAKSBEHANDLE;
    } else if (oppgaveErJournalførKlage(oppgave)) {
        return Handling.JOURNALFØR_KLAGE;
    } else if (kanJournalføres(oppgave)) {
        return Handling.JOURNALFØR;
    } else if (oppgaveErTilbakekreving(oppgave)) {
        return Handling.TILBAKE;
    } else if (oppgaveErKlage(oppgave)) {
        return Handling.KLAGE;
    } else if (oppgaveErVurderKonsekvensForYtelse(oppgave)) {
        return Handling.BEHANDLINGSOVERSIKT;
    }
    return Handling.INGEN;
};
