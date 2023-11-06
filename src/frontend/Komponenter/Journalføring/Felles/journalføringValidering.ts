import { DokumentTitler, IJournalpostResponse } from '../../../App/typer/journalføring';
import {
    BarnSomSkalFødes,
    Journalføringsaksjon,
    JournalføringStateRequest,
} from '../../../App/hooks/useJournalføringState';
import { journalføringGjelderKlage, Journalføringsårsak } from './utils';
import { Fagsak } from '../../../App/typer/fagsak';
import { alleBehandlingerErFerdigstiltEllerSattPåVent } from '../../Personoversikt/utils';
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
    const valideringsfeil = validerFellesFelter(journalResponse, journalpostState);

    if (valideringsfeil) return valideringsfeil;

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
    const valideringsfeil = validerFellesFelter(journalResponse, journalpostState);

    if (valideringsfeil) return valideringsfeil;

    if (
        !alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak) &&
        journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING
    )
        return 'Kan ikke journalføre på ny behandling når det finnes en behandling som ikke er ferdigstilt';

    if (!harGyldigeTerminDatoer(journalpostState.barnSomSkalFødes))
        return 'Et eller flere barn mangler gyldig dato';

    return undefined;
};

const validerFellesFelter = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest
): string | undefined => {
    if (journalpostState.journalføringsårsak === Journalføringsårsak.IKKE_VALGT)
        return 'Mangler journalføringsårsak (Type)';

    if (!journalpostState.stønadstype) return 'Mangler stønadstype';

    if (!harTittelForAlleDokumenter(journalResponse, journalpostState.dokumentTitler))
        return 'Mangler tittel på et eller flere dokumenter';

    if (journalResponse.journalpost.tema !== 'ENF')
        return 'Tema på journalføringsoppgaven må endres til «Enslig forsørger» i Gosys før du kan journalføre dokumentet i EF Sak';

    return undefined;
};

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
