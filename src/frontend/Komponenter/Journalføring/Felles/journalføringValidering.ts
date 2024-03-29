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
import { EVilkårsbehandleBarnValg } from '../../../App/typer/vilkårsbehandleBarnValg';

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

    if (!harGyldigeTerminDatoer(journalpostState.barnSomSkalFødes))
        return 'Et eller flere barn mangler gyldig dato';

    if (
        journalpostState.journalføringsårsak !== Journalføringsårsak.ETTERSENDING &&
        journalpostState.vilkårsbehandleNyeBarn != EVilkårsbehandleBarnValg.IKKE_VALGT
    )
        return 'Årsaken til journalføring er ettersending og man kan derfor ikke velge vilkårsbehandling av nye barn.';

    if (
        journalpostState.journalføringsårsak !== Journalføringsårsak.PAPIRSØKNAD &&
        journalpostState.barnSomSkalFødes.length > 0
    )
        return 'Årsak må være satt til papirsøknad hvis man sender inn barn som skal fødes';

    if (journalpostState.journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING) {
        return validerForJournalføringTilNyBehandling(journalResponse, journalpostState, fagsak);
    }

    return validerForJournalføringTilEksisterendeBehandling(journalpostState);
};

const validerFellesFelter = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest
): string | undefined => {
    const { journalføringsårsak, stønadstype, dokumentTitler, nyAvsender } = journalpostState;

    if (journalføringsårsak === Journalføringsårsak.IKKE_VALGT)
        return 'Mangler journalføringsårsak (Type)';

    if (!stønadstype) return 'Mangler stønadstype';

    if (!harTittelForAlleDokumenter(journalResponse, dokumentTitler))
        return 'Mangler tittel på et eller flere dokumenter';

    if (journalResponse.journalpost.tema !== 'ENF')
        return 'Tema på journalføringsoppgaven må endres til «Enslig forsørger» i Gosys før du kan journalføre dokumentet i EF Sak';

    if (
        nyAvsender?.erBruker &&
        (nyAvsender.navn === undefined ||
            nyAvsender.navn === '' ||
            nyAvsender.personIdent === undefined ||
            nyAvsender.personIdent === '')
    )
        return 'Kan ikke velge at ny avsender er bruker uten å sende inn verdier for navn og personident';

    if (nyAvsender?.erBruker === false && (nyAvsender.navn === undefined || nyAvsender.navn === ''))
        return 'Kan ikke sende inn uten avsender';

    return undefined;
};

const validerForJournalføringTilNyBehandling = (
    journalResponse: IJournalpostResponse,
    journalpostState: JournalføringStateRequest,
    fagsak: Fagsak
) => {
    if (
        journalpostState.journalføringsårsak === Journalføringsårsak.ETTERSENDING &&
        journalpostState.vilkårsbehandleNyeBarn === EVilkårsbehandleBarnValg.IKKE_VALGT
    )
        return 'Man må velge om man skal vilkårsbehandle nye barn på ny behandling av type ettersending';

    if (!alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak))
        return 'Kan ikke journalføre på ny behandling når det finnes en behandling som ikke er ferdigstilt';

    if (journalResponse.harStrukturertSøknad) {
        if (journalpostState.journalføringsårsak !== Journalføringsårsak.DIGITAL_SØKNAD) {
            return 'Årsak til journalføring må være digital søknad siden det foreligger en digital søknad på journalposten';
        }
        if (journalpostState.vilkårsbehandleNyeBarn != EVilkårsbehandleBarnValg.IKKE_VALGT)
            return 'Kan ikke velge å vilkårsbehandle nye barn når man har strukturert søknad';
    } else {
        if (journalpostState.journalføringsårsak === Journalføringsårsak.DIGITAL_SØKNAD)
            return 'Må velge mellom PAPIRSØKNAD, ETTERSENDING eller KLAGE når journalposten mangler en digital søknad';
    }

    return undefined;
};

const validerForJournalføringTilEksisterendeBehandling = (
    journalpostState: JournalføringStateRequest
) => {
    if (journalpostState.barnSomSkalFødes.length > 0) {
        return 'Kan ikke legge inn barn når man journalfører til en eksisterende behandling';
    }

    if (journalpostState.vilkårsbehandleNyeBarn !== EVilkårsbehandleBarnValg.IKKE_VALGT) {
        return 'Kan ikke vilkårsbehandle nye barn på en eksisterende behandling';
    }

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
