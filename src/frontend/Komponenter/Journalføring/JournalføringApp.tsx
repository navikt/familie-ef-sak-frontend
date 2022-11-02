import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RessursStatus } from '../../App/typer/ressurs';
import styled from 'styled-components';
import Brukerinfo from './Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from './Dokumentvisning';
import { behandlingstemaTilTekst } from '../../App/typer/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../App/hooks/useJournalføringState';
import { useHentDokument } from '../../App/hooks/useHentDokument';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { useApp } from '../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../Oppgavebenk/oppgavefilterStorage';
import BehandlingInnold from './Behandling';
import { UtledEllerVelgFagsak } from './UtledEllerVelgFagsak';
import { BodyLong, Button } from '@navikt/ds-react';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import LeggTilBarnSomSkalFødes from './LeggTilBarnSomSkalFødes';
import { IJojurnalpostResponse } from '../../App/typer/journalføring';
import VelgUstrukturertDokumentasjonType, {
    UstrukturertDokumentasjonType,
} from './VelgUstrukturertDokumentasjonType';
import { VelgFagsakForIkkeSøknad } from './VelgFagsakForIkkeSøknad';
import EttersendingMedNyeBarn from './EttersendingMedNyeBarn';
import { erAlleBehandlingerFerdigstilte, harValgtNyBehandling } from './journalførBehandlingUtil';
import { EVilkårsbehandleBarnValg } from '../../App/typer/vilkårsbehandleBarnValg';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { erGyldigDato } from '../../App/utils/dato';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { AlertError } from '../../Felles/Visningskomponenter/Alerts';
import { harTittelForAlleDokumenter } from './journalføringUtil';
import JournalføringWrapper, {
    FlexKnapper,
    Høyrekolonne,
    JournalføringAppProps,
    Kolonner,
    SideLayout,
    Venstrekolonne,
} from './JournalføringWrapper';
import JournalføringPdfVisning from './JournalføringPdfVisning';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import JournalpostTittelOgLenke from './JournalpostTittelOgLenke';

const ModalKnapp = styled(Button)`
    margin-bottom: 1rem;
    float: right;
`;

const ModalTekst = styled(BodyLong)`
    margin-top: 2rem;
`;

const erUstrukturertSøknadOgManglerDokumentasjonsType = (
    journalResponse: IJojurnalpostResponse,
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined
) =>
    !journalResponse.harStrukturertSøknad &&
    ustrukturertDokumentasjonType !== UstrukturertDokumentasjonType.PAPIRSØKNAD &&
    ustrukturertDokumentasjonType !== UstrukturertDokumentasjonType.ETTERSENDING;

const erEttersendingPåNyBehandlingOgManglerVilkårsbehandleNyeBarnValg = (
    journalpostState: JournalføringStateRequest
): boolean =>
    journalpostState.ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.ETTERSENDING &&
    harValgtNyBehandling(journalpostState.behandling) &&
    journalpostState.vilkårsbehandleNyeBarn === EVilkårsbehandleBarnValg.IKKE_VALGT;

const erEttersendingPåNyFørstegangsbehandling = (
    journalpostState: JournalføringStateRequest
): boolean =>
    journalpostState.ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.ETTERSENDING &&
    harValgtNyBehandling(journalpostState.behandling) &&
    journalpostState.behandling?.behandlingstype === Behandlingstype.FØRSTEGANGSBEHANDLING;

const inneholderBarnSomErUgyldige = (journalpostState: JournalføringStateRequest) =>
    journalpostState.barnSomSkalFødes.some(
        (barn) =>
            !barn.fødselTerminDato ||
            barn.fødselTerminDato.trim() === '' ||
            !erGyldigDato(barn.fødselTerminDato)
    );

const validerJournalføringState = (
    journalResponse: IJojurnalpostResponse,
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

export const JournalføringApp: React.FC = () => {
    return <JournalføringWrapper komponent={JournalføringAppContent} />;
};

const JournalføringAppContent: React.FC<JournalføringAppProps> = ({
    oppgaveId,
    journalResponse,
}) => {
    const { innloggetSaksbehandler } = useApp();
    const { toggles } = useToggles();
    const navigate = useNavigate();

    const journalpostId = journalResponse.journalpost.journalpostId;

    const journalpostState: JournalføringStateRequest = useJournalføringState(
        oppgaveId,
        journalpostId
    );
    const hentDokumentResponse = useHentDokument(journalResponse.journalpost);

    const { hentFagsak, fagsak } = useHentFagsak();
    const [feilmelding, settFeilMeldning] = useState('');

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
            const lagredeOppgaveFiltreringer = hentFraLocalStorage(
                oppgaveRequestKey(innloggetSaksbehandler.navIdent),
                {}
            );

            lagreTilLocalStorage(oppgaveRequestKey(innloggetSaksbehandler.navIdent), {
                ...lagredeOppgaveFiltreringer,
                ident: journalResponse.personIdent,
            });
            navigate('/oppgavebenk');
        }
    }, [innloggetSaksbehandler, journalResponse, journalpostState, navigate]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            journalpostState.settFagsakId(fagsak.data.id);
        }
        // eslint-disable-next-line
    }, [fagsak]);

    const skalBeOmBekreftelse = (
        erNyBehandling: boolean,
        harStrukturertSøknad: boolean,
        ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined
    ) => {
        if (harStrukturertSøknad) {
            return !erNyBehandling;
        } else if (ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.PAPIRSØKNAD) {
            return !erNyBehandling;
        } else if (ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.ETTERSENDING) {
            return erNyBehandling;
        } else {
            // Skal egentlige ikke komme hit pga validerJournalføringState
            return erNyBehandling;
        }
    };

    const kanLeggeTilBarnSomSkalFødes = () => {
        const erNyBehandling =
            journalpostState.behandling &&
            journalpostState.behandling.behandlingstype &&
            !journalpostState.behandling.behandlingsId;
        const harIkkeStrukturertSøknad = !journalResponse.harStrukturertSøknad;
        return (
            erNyBehandling &&
            harIkkeStrukturertSøknad &&
            journalpostState.ustrukturertDokumentasjonType ===
                UstrukturertDokumentasjonType.PAPIRSØKNAD
        );
    };

    const skalVelgeVilkårsbehandleNyeBarn =
        journalpostState.ustrukturertDokumentasjonType ===
            UstrukturertDokumentasjonType.ETTERSENDING &&
        harValgtNyBehandling(journalpostState.behandling);

    const erPapirsøknad =
        journalpostState.ustrukturertDokumentasjonType ===
        UstrukturertDokumentasjonType.PAPIRSØKNAD;
    return (
        <SideLayout className={'container'}>
            <Sidetittel>{`Registrere journalpost${
                journalResponse.journalpost.behandlingstema
                    ? ': ' + behandlingstemaTilTekst[journalResponse.journalpost.behandlingstema]
                    : ''
            }`}</Sidetittel>
            <Kolonner>
                <Venstrekolonne>
                    <JournalpostTittelOgLenke
                        journalpost={journalResponse.journalpost}
                        oppgaveId={oppgaveId}
                        visLenke={toggles[ToggleName.journalføringKlage]}
                        fra={'vanlig'}
                    />
                    {!journalResponse.harStrukturertSøknad ? (
                        <>
                            <VelgFagsakForIkkeSøknad
                                journalResponse={journalResponse}
                                hentFagsak={hentFagsak}
                            />
                            <VelgUstrukturertDokumentasjonType
                                oppgaveId={oppgaveId}
                                ustrukturertDokumentasjonType={
                                    journalpostState.ustrukturertDokumentasjonType
                                }
                                settUstrukturertDokumentasjonType={
                                    journalpostState.settUstrukturertDokumentasjonType
                                }
                            />
                        </>
                    ) : (
                        <UtledEllerVelgFagsak
                            journalResponse={journalResponse}
                            hentFagsak={hentFagsak}
                        />
                    )}
                    <Brukerinfo
                        navn={journalResponse.navn}
                        personIdent={journalResponse.personIdent}
                    />
                    <DokumentVisning
                        journalPost={journalResponse.journalpost}
                        hentDokument={hentDokumentResponse.hentDokument}
                        dokumentTitler={journalpostState.dokumentTitler}
                        settDokumentTitler={journalpostState.settDokumentTitler}
                        erPapirsøknad={erPapirsøknad}
                    />
                    <SkjemaGruppe feil={feilmelding}>
                        <BehandlingInnold
                            settBehandling={journalpostState.settBehandling}
                            behandling={journalpostState.behandling}
                            fagsak={fagsak}
                            settFeilmelding={settFeilMeldning}
                        />
                        {kanLeggeTilBarnSomSkalFødes() && (
                            <LeggTilBarnSomSkalFødes
                                barnSomSkalFødes={journalpostState.barnSomSkalFødes}
                                oppdaterBarnSomSkalFødes={journalpostState.settBarnSomSkalFødes}
                            />
                        )}
                        {skalVelgeVilkårsbehandleNyeBarn &&
                            fagsak.status === RessursStatus.SUKSESS && (
                                <EttersendingMedNyeBarn
                                    fagsak={fagsak.data}
                                    vilkårsbehandleNyeBarn={journalpostState.vilkårsbehandleNyeBarn}
                                    settVilkårsbehandleNyeBarn={
                                        journalpostState.settVilkårsbehandleNyeBarn
                                    }
                                />
                            )}
                    </SkjemaGruppe>
                    {(journalpostState.innsending.status === RessursStatus.FEILET ||
                        journalpostState.innsending.status === RessursStatus.FUNKSJONELL_FEIL) && (
                        <AlertError>{journalpostState.innsending.frontendFeilmelding}</AlertError>
                    )}
                    <FlexKnapper>
                        <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                        <Hovedknapp
                            onClick={() => {
                                const feilmeldingFraValidering = validerJournalføringState(
                                    journalResponse,
                                    journalpostState,
                                    erAlleBehandlingerFerdigstilte(fagsak)
                                );
                                if (feilmeldingFraValidering) {
                                    settFeilMeldning(feilmeldingFraValidering);
                                } else if (
                                    skalBeOmBekreftelse(
                                        harValgtNyBehandling(journalpostState.behandling),
                                        journalResponse.harStrukturertSøknad,
                                        journalpostState.ustrukturertDokumentasjonType
                                    )
                                ) {
                                    if (journalResponse.harStrukturertSøknad) {
                                        journalpostState.settVisBekreftelsesModal(true);
                                    } else if (!journalResponse.harStrukturertSøknad) {
                                        journalpostState.settJournalføringIkkeMuligModal(true);
                                    }
                                } else {
                                    journalpostState.fullførJournalføring(
                                        innloggetSaksbehandler?.enhet || '9999',
                                        innloggetSaksbehandler?.navIdent
                                    );
                                }
                            }}
                            spinner={journalpostState.innsending.status === RessursStatus.HENTER}
                        >
                            Journalfør
                        </Hovedknapp>
                    </FlexKnapper>
                </Venstrekolonne>
                <Høyrekolonne>
                    <JournalføringPdfVisning hentDokumentResponse={hentDokumentResponse} />
                </Høyrekolonne>
            </Kolonner>
            <BekreftJournalføringModal
                journalpostState={journalpostState}
                innloggetSaksbehandler={innloggetSaksbehandler}
            />
            <JournalføringIkkeMuligModal
                visModal={journalpostState.visJournalføringIkkeMuligModal}
                settVisModal={journalpostState.settJournalføringIkkeMuligModal}
                erPapirSøknad={erPapirsøknad}
            />
        </SideLayout>
    );
};

const JournalføringIkkeMuligModal: React.FC<{
    visModal: boolean;
    settVisModal: Dispatch<SetStateAction<boolean>>;
    erPapirSøknad: boolean;
}> = ({ visModal, settVisModal, erPapirSøknad }) => {
    return (
        <ModalWrapper
            tittel={'Journalføring ikke mulig'}
            visModal={visModal}
            onClose={() => settVisModal(false)}
        >
            {erPapirSøknad ? (
                <BodyLong>
                    Foreløpig er det dessverre ikke mulig å journalføre på en eksisterende
                    behandling via journalføringsbildet når det ikke er tilknyttet en digital søknad
                    til journalposten.
                </BodyLong>
            ) : (
                <BodyLong>
                    Foreløpig er det dessverre ikke mulig å opprette en ny behandling via
                    journalføringsbildet når det ikke er tilknyttet en digital søknad til
                    journalposten. Gå inntil videre inn i behandlingsoversikten til bruker og
                    opprett ny behandling derifra. Deretter kan du journalføre mot den nye
                    behandlingen.
                </BodyLong>
            )}
            <ModalKnapp variant={'tertiary'} onClick={() => settVisModal(false)}>
                Tilbake
            </ModalKnapp>
        </ModalWrapper>
    );
};

const BekreftJournalføringModal: React.FC<{
    journalpostState: JournalføringStateRequest;
    innloggetSaksbehandler: ISaksbehandler;
}> = ({ journalpostState, innloggetSaksbehandler }) => {
    return (
        <ModalWrapper
            tittel={''}
            visModal={journalpostState.visBekreftelsesModal}
            onClose={() => journalpostState.settVisBekreftelsesModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        journalpostState.settVisBekreftelsesModal(false);
                        journalpostState.fullførJournalføring(
                            innloggetSaksbehandler?.enhet || '9999',
                            innloggetSaksbehandler?.navIdent
                        );
                    },
                    tekst: 'Journalfør allikevel',
                },
                lukkKnapp: {
                    onClick: () => journalpostState.settVisBekreftelsesModal(false),
                    tekst: 'Tilbake',
                },
            }}
            ariaLabel={'Bekreft journalføring av oppgave, eller avbryt'}
        >
            <ModalTekst>
                Behandlingen du har valgt har allerede en digital søknad tilknyttet seg. Om du skal
                gjennomføre en ny saksbehandling av søknaden må du opprette en ny behandling.
            </ModalTekst>
        </ModalWrapper>
    );
};
