import { IJournalpostResponse, LogiskVedlegg } from '../../../App/typer/journalføring';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Behandling, BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Journalføringsaksjon } from '../../../App/hooks/useJournalføringState';
import { ISelectOption, MultiValue, SingleValue } from '@navikt/familie-form-elements';
import { Klagebehandlinger } from '../../../App/typer/klage';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';
export type MultiSelectValue = { label: string; value: string };

export const lagJournalføringUrl = (journalpostId: string, oppgaveId: string | number): string =>
    `/journalfor?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}`;

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

export const mapDokumentTittelTilMultiselectValue = (tittel: string) => {
    return { value: tittel, label: tittel };
};

export const mapLogiskeVedleggTilMultiselectValue = (logiskeVedlegg: LogiskVedlegg[]) => {
    return logiskeVedlegg.map((vedlegg) => {
        return { label: vedlegg.tittel, value: vedlegg.tittel };
    });
};

export const mapMultiselectValueTilLogiskeVedlegg = (
    values: MultiValue<MultiSelectValue> | SingleValue<MultiSelectValue>
) => {
    if ((values as MultiValue<MultiSelectValue>).length !== undefined) {
        return (values as MultiValue<MultiSelectValue>).map((value) => value.value);
    } else {
        const value = values as SingleValue<MultiSelectValue>;
        return [value === null ? '' : value.value];
    }
};

export enum Journalføringsårsak {
    DIGITAL_SØKNAD = 'DIGITAL_SØKNAD',
    ETTERSENDING = 'ETTERSENDING',
    IKKE_VALGT = 'IKKE_VALGT',
    KLAGE = 'KLAGE',
    KLAGE_TILBAKEKREVING = 'KLAGE_TILBAKEKREVING',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
}

export const journalføringsårsakTilTekst: Record<Journalføringsårsak, string> = {
    DIGITAL_SØKNAD: 'Digital søknad',
    ETTERSENDING: 'Ettersending',
    IKKE_VALGT: 'Ikke valgt',
    KLAGE: 'Klage',
    KLAGE_TILBAKEKREVING: 'Klage',
    PAPIRSØKNAD: 'Papirsøknad',
};

export const journalføringGjelderKlage = (journalføringsårsak: Journalføringsårsak) =>
    journalføringsårsak === Journalføringsårsak.KLAGE ||
    journalføringsårsak === Journalføringsårsak.KLAGE_TILBAKEKREVING;

export const stønadstypeTilKey = (
    stønadstype: Stønadstype | undefined
): keyof Klagebehandlinger | undefined => {
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return 'overgangsstønad';
        case Stønadstype.BARNETILSYN:
            return 'barnetilsyn';
        case Stønadstype.SKOLEPENGER:
            return 'skolepenger';
        default:
            return undefined;
    }
};

export const skalViseBekreftelsesmodal = (
    journalResponse: IJournalpostResponse,
    journalføringsaksjon: Journalføringsaksjon,
    erPapirSøknad: boolean
) =>
    journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING
        ? false
        : journalResponse.harStrukturertSøknad || erPapirSøknad;

export enum UstrukturertDokumentasjonType {
    PAPIRSØKNAD = 'PAPIRSØKNAD',
    ETTERSENDING = 'ETTERSENDING',
    IKKE_VALGT = 'IKKE_VALGT',
}
