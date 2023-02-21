import { DokumentTitler, IJojurnalpostResponse } from '../../App/typer/journalføring';
import { Behandlingstema, behandlingstemaTilTekst } from '../../App/typer/behandlingstema';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';

export const lagJournalføringKlageUrl = (
    journalpostId: string,
    oppgaveId: string | number
): string => {
    return `/journalfor-klage?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}`;
};

export const lagJournalføringUrl = (journalpostId: string, oppgaveId: string | number): string => {
    return `/journalfor?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}`;
};

export const harTittelForAlleDokumenter = (
    journalResponse: IJojurnalpostResponse,
    dokumentTitler?: DokumentTitler
) =>
    journalResponse.journalpost.dokumenter
        .map((d) => d.tittel || (dokumentTitler && dokumentTitler[d.dokumentInfoId]))
        .every((tittel) => tittel && tittel.trim());

export const utledKolonneTittel = (
    behandlingsTema: Behandlingstema | undefined,
    fra: 'klage' | 'vanlig'
) => {
    const prefix = 'Registrere journalpost';
    const type = fra === 'klage' ? ' for klage' : '';
    const stønadstype = behandlingsTema ? ': ' + behandlingstemaTilTekst[behandlingsTema] : '';
    return `${prefix}${type}${stønadstype}`;
};

export const dokumentTitler: { value: string; label: string }[] = [
    { value: 'Uttalelse tilbakekreving', label: 'Uttalelse tilbakekreving' },
    { value: 'Uttalelse', label: 'Uttalelse' },
    {
        value: 'Tilmelding til NAV som reell arbeidssøker ved krav om overgangsstønad',
        label: "Tilmelding til NAV som reell arbeidssøker ved krav om overgangsstønad'",
    },
    {
        value: 'Søknad om stønad til skolepenger - enslig mor eller far',
        label: 'Søknad om stønad til skolepenger - enslig mor eller far',
    },
    {
        value: 'Søknad om stønad til barnetilsyn - enslig mor eller far i arbeid',
        label: 'Søknad om stønad til skolepenger - enslig mor eller far',
    },
    {
        value: 'Søknad om overgangsstønad - enslig mor eller far',
        label: 'Søknad om overgangsstønad - enslig mor eller far',
    },
    { value: 'Stevning', label: 'Stevning' },
    { value: 'Skatteopplysninger', label: 'Skatteopplysninger' },
    { value: 'Rettsavgjørelse', label: 'Rettsavgjørelse' },
    { value: 'Refusjonskrav/faktura', label: 'Refusjonskrav/faktura' },
    { value: 'Oppholdstillatelse', label: 'Oppholdstillatelse' },
    { value: 'Merknader i ankesak', label: 'Merknader i ankesak' },
    { value: 'Medisinsk dokumentasjon', label: 'Medisinsk dokumentasjon' },
    { value: 'Krav om gjenopptak av ankesak', label: 'Krav om gjenopptak av ankesak' },
    { value: 'Klage/Anke', label: 'Klage/Anke' },
    { value: 'Klage på tilbakekreving', label: 'Klage på tilbakekreving' },
    { value: 'Inntektsopplysninger', label: 'Inntektsopplysninger' },
    { value: 'Grunnblankett', label: 'Grunnblankett' },
    { value: 'Fødselsmelding/Fødselsattest', label: 'Fødselsmelding/Fødselsattest' },
    { value: 'Forespørsel', label: 'Forespørsel' },
    { value: 'EØS-dokument', label: 'EØS-dokument' },
    { value: 'Erklæring samlivsbrudd', label: 'Erklæring samlivsbrudd' },
    {
        value: 'Enslig mor eller far som er arbeidssøker',
        label: 'nslig mor eller far som er arbeidssøker',
    },
    { value: 'Endring i sivilstand', label: 'Endring i sivilstand' },
    { value: 'Bekreftelse på utdanning / utgifter', label: 'Bekreftelse på utdanning / utgifter' },
    { value: 'Bekreftelse på tilsynsutgifter', label: 'Bekreftelse på tilsynsutgifter' },
    { value: 'Bekreftelse på termindato', label: 'Bekreftelse på termindato' },
    { value: 'Bekreftelse fra barnevernet', label: 'Bekreftelse fra barnevernet' },
    { value: 'Avtale / avgjørelse om samvær', label: 'Avtale / avgjørelse om samvær' },
    { value: 'Arbeidsforhold', label: 'Arbeidsforhold' },
    { value: 'Anke på tilbakekreving', label: 'Anke på tilbakekreving' },
];
