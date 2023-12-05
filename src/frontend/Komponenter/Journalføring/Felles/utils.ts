import {
    DokumentTitler,
    IJournalpost,
    IJournalpostResponse,
    LogiskVedlegg,
} from '../../../App/typer/journalføring';
import {
    Behandlingstema,
    behandlingstemaTilTekst,
    Stønadstype,
} from '../../../App/typer/behandlingstema';
import { Behandling, BehandlingResultat } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import {
    BehandlingRequest,
    JournalføringRequestV2,
    Journalføringsaksjon,
} from '../../../App/hooks/useJournalføringState';
import { BehandlingKlageRequest } from '../../../App/hooks/useJournalføringKlageState';
import { ISelectOption, MultiValue, SingleValue } from '@navikt/familie-form-elements';
import { Klagebehandlinger } from '../../../App/typer/klage';
import { JournalføringEvent } from '../../../App/utils/amplitude/typer';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const GJELDER_KLAGE_QUERY_STRING = 'gjelderKlage';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';
export type MultiSelectValue = { label: string; value: string };

export const lagJournalføringKlageUrl = (
    journalpostId: string,
    oppgaveId: string | number
): string => {
    return `/journalfor-klage?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}`;
};

export const lagJournalføringUrl = (
    journalpostId: string,
    oppgaveId: string | number,
    gjelderKlage?: boolean
): string => {
    return `/journalfor?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}&gjelderKlage=${gjelderKlage}`;
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

export const utledJournalføringEvent = (
    request: JournalføringRequestV2,
    journalpost: IJournalpost,
    stønadstype?: Stønadstype
): JournalføringEvent => {
    const erLogiskeVedleggUendret: boolean = journalpost.dokumenter?.every((dokument) => {
        const logiskeVedleggForDokumentRequest = request.logiskeVedlegg
            ? request.logiskeVedlegg[dokument.dokumentInfoId]
            : [];

        const harSammeAntallForDokument =
            logiskeVedleggForDokumentRequest.length === dokument.logiskeVedlegg.length;
        const harSammeTitlerPåLogiskeVedlegg = logiskeVedleggForDokumentRequest.every((l) =>
            dokument.logiskeVedlegg.filter((ll) => ll.tittel === l.tittel)
        );
        return harSammeAntallForDokument && harSammeTitlerPåLogiskeVedlegg;
    });
    return {
        harEndretAvsender: request.nyAvsender
            ? journalpost.avsenderMottaker?.navn !== request.nyAvsender.navn
            : false,
        harEndretLogiskeVedlegg: !erLogiskeVedleggUendret,
        aksjon: request.aksjon,
        årsak: request.årsak,
        stønadstype: stønadstype,
        harBarnSomSkalFødes: request.barnSomSkalFødes.length > 0,
    };
};
