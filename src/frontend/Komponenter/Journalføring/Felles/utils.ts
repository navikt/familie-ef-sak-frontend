import { DokumentTitler, IJournalpostResponse } from '../../../App/typer/journalføring';
import { Behandlingstema, behandlingstemaTilTekst } from '../../../App/typer/behandlingstema';
import { Behandling, BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { BehandlingRequest } from '../../../App/hooks/useJournalføringState';
import { BehandlingKlageRequest } from '../../../App/hooks/useJournalføringKlageState';
import { ISelectOption } from '@navikt/familie-form-elements';

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
    journalResponse: IJournalpostResponse,
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

export const utledRiktigBehandlingstype = (
    tidligereBehandlinger: Behandling[]
): Behandlingstype => {
    const harIverksattTidligereBehandlinger = tidligereBehandlinger.some(
        (tidligereBehandling) => tidligereBehandling.resultat !== BehandlingResultat.HENLAGT
    );

    return harIverksattTidligereBehandlinger
        ? Behandlingstype.REVURDERING
        : Behandlingstype.FØRSTEGANGSBEHANDLING;
};

export const harValgtNyBehandling = (behandling: BehandlingRequest | undefined): boolean =>
    behandling !== undefined && behandling.behandlingsId === undefined;

export const harValgtNyKlageBehandling = (
    behandling: BehandlingKlageRequest | undefined
): boolean => behandling !== undefined && behandling.behandlingId === undefined;

const dokumentTitler: string[] = [
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Avtale / Avgjørelse om samvær',
    'Bekreftelse fra barnevernet',
    'Bekreftelse på termindato',
    'Bekreftelse på tilsynsutgifter',
    'Bekreftelse på utdanning / utgifter',
    'Endring i sivilstand',
    'Enslig mor eller far som er arbeidssøker',
    'Eklæring om samlivsbrudd',
    'EØS dokument',
    'Forespørsel',
    'Fødselsmelding/Fødselsattest',
    'Grunnblankett',
    'Inntektsopplysninger',
    'Klage på tilbakekreving',
    'Klage/Anke',
    'Krav om gjenopptak av ankesak',
    'Medisinsk dokumentasjon',
    'Merknader i ankesak',
    'Oppholdstillatelse',
    'Refusjonskrav/faktura',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad om overgangsstønad',
    'Søknad om skolepenger',
    'Søknad om barnetilsyn',
    'Tilmelding til NAV som reell arbeidssøker ved krav om overgangsstønad',
    'Uttalelse',
    'Uttalelse tilbakekreving',
];

export const dokumentTitlerMultiSelect: ISelectOption[] = dokumentTitler.map((tittel) => {
    return { value: tittel, label: tittel };
});

export const mapDokumentTittel = (tittel: string) => {
    return { value: tittel, label: tittel };
};
