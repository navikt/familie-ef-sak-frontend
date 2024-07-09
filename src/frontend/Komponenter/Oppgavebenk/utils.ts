import { IOppgave } from './typer/oppgave';
import { IMappe } from './typer/mappe';
import { IdentGruppe } from './typer/oppgaveIdent';

export const oppgaveErSaksbehandling = (oppgave: IOppgave) => {
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

export const oppgaveErTilbakekreving = (oppgave: IOppgave) => {
    return (
        // oppgave.behandlingstema === 'ab0071' && //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver må denne sjekken inkluderes
        oppgave.behandlesAvApplikasjon === 'familie-tilbake' && oppgave.behandlingstype === 'ae0161'
    );
};

export const oppgaveErKlage = (oppgave: IOppgave) =>
    oppgave.behandlesAvApplikasjon === 'familie-klage' && oppgave.behandlingstype === 'ae0058';

export const oppgaveErJournalførKlage = (oppgave: IOppgave) =>
    oppgave.oppgavetype === 'JFR' && oppgave.behandlingstype === 'ae0058';

export const oppgaveErVurderKonsekvensForYtelse = (oppgave: IOppgave) => {
    return oppgave.oppgavetype === 'VUR_KONS_YTE';
};

export const oppgaveKanJournalføres = (oppgave: IOppgave) => oppgave.oppgavetype === 'JFR';

export const sorterMapperPåNavn = (a: IMappe, b: IMappe) => {
    if (a.navn > b.navn) return 1;
    else if (a.navn < b.navn) return -1;
    return 0;
};
