import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { JournalføringStateRequest } from '../../../App/hooks/useJournalføringState';
import {
    harTittelForAlleDokumenter,
    harValgtNyBehandling,
    harValgtNyKlageBehandling,
} from './utils';
import { UstrukturertDokumentasjonType } from '../Standard/VelgUstrukturertDokumentasjonType';
import { erGyldigDato } from '../../../App/utils/dato';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { EVilkårsbehandleBarnValg } from '../../../App/typer/vilkårsbehandleBarnValg';
import { JournalføringKlageStateRequest } from '../../../App/hooks/useJournalføringKlageState';

export const validerJournalføringState = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest,
    erAlleBehandlingerFerdigstilte: boolean
): string | undefined => {
    if (!journalpostState.behandling) {
        return 'Du må velge en behandling for å journalføre';
    } else if (
        !erAlleBehandlingerFerdigstilte &&
        harValgtNyBehandling(journalpostState.behandling)
    ) {
        return 'Kan ikke journalføre på ny behandling når det finnes en behandling som ikke er ferdigstilt';
    } else if (
        erUstrukturertSøknadOgManglerDokumentasjonsType(
            journalResponse,
            journalpostState.ustrukturertDokumentasjonType
        )
    ) {
        return 'Mangler type dokumentasjon';
    } else if (inneholderBarnSomErUgyldige(journalpostState)) {
        return 'Et eller flere barn mangler gyldig dato';
    } else if (!harTittelForAlleDokumenter(journalResponse, journalpostState.dokumentTitler)) {
        return 'Mangler tittel på et eller flere dokumenter';
    } else if (erEttersendingPåNyFørstegangsbehandling(journalpostState)) {
        return 'Kan ikke journalføre ettersending på ny førstegangsbehandling';
    } else if (erEttersendingPåNyBehandlingOgManglerVilkårsbehandleNyeBarnValg(journalpostState)) {
        return 'Mangler valg om å vilkårsbehandle nye barn';
    } else if (journalResponse.journalpost.tema !== 'ENF') {
        return 'Tema på journalføringsoppgaven må endres til «Enslig forsørger» i Gosys før du kan journalføre dokumentet i EF Sak';
    } else {
        return undefined;
    }
};

export const validerJournalføringKlageState = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringKlageStateRequest
): string | undefined => {
    if (!journalpostState.behandling) {
        return 'Du må velge en behandling for å journalføre';
    } else if (!harTittelForAlleDokumenter(journalResponse, journalpostState.dokumentTitler)) {
        return 'Mangler tittel på et eller flere dokumenter';
    } else if (journalResponse.journalpost.tema !== 'ENF') {
        return 'Tema på journalføringsoppgaven må endres til «Enslig forsørger» i Gosys før du kan journalføre dokumentet i EF Sak';
    } else if (
        harValgtNyKlageBehandling(journalpostState.behandling) &&
        !journalResponse.journalpost.datoMottatt &&
        (!journalpostState.behandling.mottattDato ||
            !erGyldigDato(journalpostState.behandling.mottattDato))
    ) {
        return 'Mangler gyldig mottatt dato';
    } else {
        return undefined;
    }
};

const erUstrukturertSøknadOgManglerDokumentasjonsType = (
    journalResponse: IJournalpostResponse,
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined
) =>
    !journalResponse.harStrukturertSøknad &&
    ustrukturertDokumentasjonType !== UstrukturertDokumentasjonType.PAPIRSØKNAD &&
    ustrukturertDokumentasjonType !== UstrukturertDokumentasjonType.ETTERSENDING;

const inneholderBarnSomErUgyldige = (journalpostState: JournalføringStateRequest) =>
    journalpostState.barnSomSkalFødes.some(
        (barn) =>
            !barn.fødselTerminDato ||
            barn.fødselTerminDato.trim() === '' ||
            !erGyldigDato(barn.fødselTerminDato)
    );

const erEttersendingPåNyFørstegangsbehandling = (
    journalpostState: JournalføringStateRequest
): boolean =>
    journalpostState.ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.ETTERSENDING &&
    harValgtNyBehandling(journalpostState.behandling) &&
    journalpostState.behandling?.behandlingstype === Behandlingstype.FØRSTEGANGSBEHANDLING;

const erEttersendingPåNyBehandlingOgManglerVilkårsbehandleNyeBarnValg = (
    journalpostState: JournalføringStateRequest
): boolean =>
    journalpostState.ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.ETTERSENDING &&
    harValgtNyBehandling(journalpostState.behandling) &&
    journalpostState.vilkårsbehandleNyeBarn === EVilkårsbehandleBarnValg.IKKE_VALGT;
