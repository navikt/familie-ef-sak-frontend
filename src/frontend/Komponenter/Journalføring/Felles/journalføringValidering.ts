import { DokumentTitler, IJournalpostResponse } from '../../../App/typer/journalføring';
import {
    BarnSomSkalFødes,
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { journalføringGjelderKlage } from './utils';
import { Fagsak } from '../../../App/typer/fagsak';
import { alleBehandlingerErFerdigstiltEllerSattPåVent } from '../../Personoversikt/utils';
import { UstrukturertDokumentasjonType } from '../Standard/VelgUstrukturertDokumentasjonType';
import { erGyldigDato } from '../../../App/utils/dato';

export const validerJournalføring = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest,
    fagsak: Fagsak
): string | undefined => {
    if (journalføringGjelderKlage(journalpostState.journalføringsårsak))
        return validerKlageJournalføring(journalResponse, journalpostState);
    return validerStandardJournalføring(journalResponse, journalpostState, fagsak);
};

const validerKlageJournalføring = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest
): string | undefined => {
    validerFellesFelter(journalResponse, journalpostState);

    if (
        journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING &&
        !journalResponse.journalpost.datoMottatt
    )
        return 'Mangler gyldig mottatt dato';

    return undefined;
};

const validerStandardJournalføring = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest,
    fagsak: Fagsak
): string | undefined => {
    validerFellesFelter(journalResponse, journalpostState);

    if (
        !alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak) &&
        journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING
    )
        return 'Kan ikke journalføre på ny behandling når det finnes en behandling som ikke er ferdigstilt';

    if (
        !erStrukturertSøknad(journalResponse) &&
        !harDokumentasjonstype(journalpostState.ustrukturertDokumentasjonType)
    )
        return 'Mangler dokumentasjonstype';

    if (!harGyldigeTerminDatoer(journalpostState.barnSomSkalFødes))
        return 'Et eller flere barn mangler gyldig dato';

    return undefined;
};

const validerFellesFelter = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest
): string | undefined => {
    if (!harTittelForAlleDokumenter(journalResponse, journalpostState.dokumentTitler))
        return 'Mangler tittel på et eller flere dokumenter';

    if (journalResponse.journalpost.tema !== 'ENF')
        return 'Tema på journalføringsoppgaven må endres til «Enslig forsørger» i Gosys før du kan journalføre dokumentet i EF Sak';

    return undefined;
};

const erStrukturertSøknad = (journalResponse: IJournalpostResponse) =>
    journalResponse.harStrukturertSøknad;

const harDokumentasjonstype = (
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined
) =>
    ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.ETTERSENDING ||
    ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.PAPIRSØKNAD;

const harGyldigeTerminDatoer = (barnSomSkalFødes: BarnSomSkalFødes[]) =>
    barnSomSkalFødes.every(
        (barn) =>
            barn.fødselTerminDato &&
            barn.fødselTerminDato.trim() !== '' &&
            erGyldigDato(barn.fødselTerminDato)
    );

const harTittelForAlleDokumenter = (
    journalResponse: IJournalpostResponse,
    dokumentTitler?: DokumentTitler
) =>
    journalResponse.journalpost.dokumenter
        .map((d) => d.tittel || (dokumentTitler && dokumentTitler[d.dokumentInfoId]))
        .every((tittel) => tittel && tittel.trim());
