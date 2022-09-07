import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RessursStatus } from '../../App/typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import Brukerinfo from './Brukerinfo';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from './Dokumentvisning';
import { behandlingstemaTilTekst } from '../../App/typer/behandlingstema';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../App/hooks/useJournalføringState';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import { useHentDokument } from '../../App/hooks/useHentDokument';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { useApp } from '../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../Oppgavebenk/oppgavefilterStorage';
import BehandlingInnold from './Behandling';
import UIModalWrapper from '../../Felles/Modal/UIModalWrapper';
import { UtledEllerVelgFagsak } from './UtledEllerVelgFagsak';
import { Button } from '@navikt/ds-react';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import LeggTilBarnSomSkalFødes from './LeggTilBarnSomSkalFødes';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { IJojurnalpostResponse } from '../../App/typer/journalforing';
import VelgUstrukturertDokumentasjonType, {
    UstrukturertDokumentasjonType,
} from './VelgUstrukturertDokumentasjonType';
import { VelgFagsakForIkkeSøknad } from './VelgFagsakForIkkeSøknad';
import EttersendingMedNyeBarn from './EttersendingMedNyeBarn';
import { erAlleBehandlingerFerdigstilte, harValgtNyBehandling } from './journalførBehandlingUtil';
import { EVilkårsbehandleBarnValg } from '../../App/typer/vilkårsbehandleBarnValg';
import { Behandlingstype } from '../../App/typer/behandlingstype';

const SideLayout = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: 2rem;
`;

const Kolonner = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`;

export const KnappWrapper = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .flex-item {
        margin-right: 1.5rem;
    }
`;

const Venstrekolonne = styled.div`
    max-width: 900px;
`;
const Høyrekolonne = styled.div``;
const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

const harTittelForAlleDokumenter = (
    journalResponse: IJojurnalpostResponse,
    journalpostState: JournalføringStateRequest
) =>
    journalResponse.journalpost.dokumenter
        .map(
            (d) =>
                d.tittel ||
                (journalpostState.dokumentTitler &&
                    journalpostState.dokumentTitler[d.dokumentInfoId])
        )
        .every((tittel) => tittel && tittel.trim());

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
        (barn) => !barn.fødselTerminDato || barn.fødselTerminDato.trim() === ''
    );

const validerJournalføringState = (
    journalResponse: IJojurnalpostResponse,
    journalpostState: JournalføringStateRequest,
    erAlleBehandlingerFerdigstilte: boolean,
    kanJournalføreEttersendingNyBehandling: boolean
): string | undefined => {
    if (!erAlleBehandlingerFerdigstilte && harValgtNyBehandling(journalpostState.behandling)) {
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
    } else if (!harTittelForAlleDokumenter(journalResponse, journalpostState)) {
        return 'Mangler tittel på et eller flere dokumenter';
    } else if (erEttersendingPåNyFørstegangsbehandling(journalpostState)) {
        return 'Kan ikke journalføre ettersending på ny førstegangsbehandling';
    } else if (
        kanJournalføreEttersendingNyBehandling &&
        erEttersendingPåNyBehandlingOgManglerVilkårsbehandleNyeBarnValg(journalpostState)
    ) {
        return 'Mangler valg om å vilkårsbehandle nye barn';
    } else {
        return undefined;
    }
};

export const JournalforingApp: React.FC = () => {
    const { innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();
    const { toggles } = useToggles();
    const query: URLSearchParams = useQueryParams();
    const oppgaveIdParam = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostIdParam = query.get(JOURNALPOST_QUERY_STRING);

    const journalpostState: JournalføringStateRequest = useJournalføringState();
    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostIdParam);
    const {
        hentDokument,
        valgtDokument,
        hentFørsteDokument,
        hentNesteDokument,
        hentForrigeDokument,
    } = useHentDokument(journalpostIdParam);
    const { hentFagsak, fagsak } = useHentFagsak();
    const [feilmelding, settFeilMeldning] = useState('');

    useEffect(() => {
        if (journalpostState.forsøktJournalført && !journalpostState.behandling) {
            settFeilMeldning('Du må velge en behandling for å journalføre');
        }
    }, [journalpostState]);

    useEffect(() => {
        if (oppgaveIdParam && journalpostIdParam) {
            hentJournalPost();
            journalpostState.settOppgaveId(oppgaveIdParam);
        }
        // eslint-disable-next-line
    }, [oppgaveIdParam, journalpostIdParam]);

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
            const lagredeOppgaveFiltreringer = hentFraLocalStorage(
                oppgaveRequestKey(innloggetSaksbehandler.navIdent),
                {}
            );

            lagreTilLocalStorage(oppgaveRequestKey(innloggetSaksbehandler.navIdent), {
                ...lagredeOppgaveFiltreringer,
                ident:
                    journalResponse.status === RessursStatus.SUKSESS
                        ? journalResponse.data.personIdent
                        : undefined,
            });
            navigate('/oppgavebenk');
        }
        // eslint-disable-next-line
    }, [journalpostState.innsending]);

    useEffect(() => {
        if (journalResponse.status === RessursStatus.SUKSESS) {
            hentFørsteDokument(journalResponse.data.journalpost);
        }
        // eslint-disable-next-line
    }, [journalResponse]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            journalpostState.settFagsakId(fagsak.data.id);
        }
        // eslint-disable-next-line
    }, [fagsak]);

    useEffect(() => {
        document.title = 'Journalpost';
    }, []);

    if (!oppgaveIdParam || !journalpostIdParam) {
        return <Navigate to="/oppgavebenk" />;
    }

    const kanJournalføreEttersendingNyBehandling =
        toggles[ToggleName.kanJournalføreEttersendingNyBehandling];

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
            return erNyBehandling && !kanJournalføreEttersendingNyBehandling;
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
        const harIkkeStrukturertSøknad =
            journalResponse.status === RessursStatus.SUKSESS &&
            !journalResponse.data.harStrukturertSøknad;
        return (
            toggles[ToggleName.kanLeggeTilTerminbarnVidJournalføring] &&
            erNyBehandling &&
            harIkkeStrukturertSøknad &&
            journalpostState.ustrukturertDokumentasjonType ===
                UstrukturertDokumentasjonType.PAPIRSØKNAD
        );
    };

    const skalVelgeVilkårsbehandleNyeBarn =
        kanJournalføreEttersendingNyBehandling &&
        journalpostState.ustrukturertDokumentasjonType ===
            UstrukturertDokumentasjonType.ETTERSENDING &&
        harValgtNyBehandling(journalpostState.behandling);

    return (
        <DataViewer response={{ journalResponse }}>
            {({ journalResponse }) => {
                const erPapirsøknad =
                    journalpostState.ustrukturertDokumentasjonType ===
                    UstrukturertDokumentasjonType.PAPIRSØKNAD;
                return (
                    <SideLayout className={'container'}>
                        <Sidetittel>{`Registrere journalpost${
                            journalResponse.journalpost.behandlingstema
                                ? ': ' +
                                  behandlingstemaTilTekst[
                                      journalResponse.journalpost.behandlingstema
                                  ]
                                : ''
                        }`}</Sidetittel>
                        <Kolonner>
                            <Venstrekolonne>
                                {!journalResponse.harStrukturertSøknad ? (
                                    <>
                                        <VelgFagsakForIkkeSøknad
                                            journalResponse={journalResponse}
                                            hentFagsak={hentFagsak}
                                        />
                                        <VelgUstrukturertDokumentasjonType
                                            oppgaveId={oppgaveIdParam}
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
                                    hentDokument={hentDokument}
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
                                            oppdaterBarnSomSkalFødes={
                                                journalpostState.settBarnSomSkalFødes
                                            }
                                        />
                                    )}
                                    {skalVelgeVilkårsbehandleNyeBarn &&
                                        fagsak.status === RessursStatus.SUKSESS && (
                                            <EttersendingMedNyeBarn
                                                fagsak={fagsak.data}
                                                vilkårsbehandleNyeBarn={
                                                    journalpostState.vilkårsbehandleNyeBarn
                                                }
                                                settVilkårsbehandleNyeBarn={
                                                    journalpostState.settVilkårsbehandleNyeBarn
                                                }
                                            />
                                        )}
                                </SkjemaGruppe>
                                {(journalpostState.innsending.status === RessursStatus.FEILET ||
                                    journalpostState.innsending.status ===
                                        RessursStatus.FUNKSJONELL_FEIL) && (
                                    <AlertStripeFeil>
                                        {journalpostState.innsending.frontendFeilmelding}
                                    </AlertStripeFeil>
                                )}
                                <FlexKnapper>
                                    <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                                    <Hovedknapp
                                        onClick={() => {
                                            const feilmeldingFraValidering =
                                                validerJournalføringState(
                                                    journalResponse,
                                                    journalpostState,
                                                    erAlleBehandlingerFerdigstilte(fagsak),
                                                    kanJournalføreEttersendingNyBehandling
                                                );
                                            if (feilmeldingFraValidering) {
                                                settFeilMeldning(feilmeldingFraValidering);
                                            } else if (
                                                skalBeOmBekreftelse(
                                                    harValgtNyBehandling(
                                                        journalpostState.behandling
                                                    ),
                                                    journalResponse.harStrukturertSøknad,
                                                    journalpostState.ustrukturertDokumentasjonType
                                                )
                                            ) {
                                                if (journalResponse.harStrukturertSøknad) {
                                                    journalpostState.settVisBekreftelsesModal(true);
                                                } else if (!journalResponse.harStrukturertSøknad) {
                                                    journalpostState.settJournalføringIkkeMuligModal(
                                                        true
                                                    );
                                                }
                                            } else {
                                                journalpostState.fullførJournalføring(
                                                    journalpostIdParam,
                                                    innloggetSaksbehandler?.enhet || '9999',
                                                    innloggetSaksbehandler?.navIdent
                                                );
                                            }
                                        }}
                                        spinner={
                                            journalpostState.innsending.status ===
                                            RessursStatus.HENTER
                                        }
                                    >
                                        Journalfør
                                    </Hovedknapp>
                                </FlexKnapper>
                            </Venstrekolonne>
                            <Høyrekolonne>
                                <FlexKnapper>
                                    <Knapp
                                        onClick={() =>
                                            hentForrigeDokument(journalResponse.journalpost)
                                        }
                                        mini
                                    >
                                        Forrige Dokument
                                    </Knapp>
                                    <Knapp
                                        onClick={() =>
                                            hentNesteDokument(journalResponse.journalpost)
                                        }
                                        mini
                                    >
                                        Neste Dokument
                                    </Knapp>
                                </FlexKnapper>
                                <PdfVisning pdfFilInnhold={valgtDokument} />
                            </Høyrekolonne>
                        </Kolonner>
                        <BekreftJournalføringModal
                            journalpostState={journalpostState}
                            journalpostId={journalpostIdParam}
                            innloggetSaksbehandler={innloggetSaksbehandler}
                        />
                        <JournalføringIkkeMuligModal
                            visModal={journalpostState.visJournalføringIkkeMuligModal}
                            settVisModal={journalpostState.settJournalføringIkkeMuligModal}
                            erPapirSøknad={erPapirsøknad}
                        />
                    </SideLayout>
                );
            }}
        </DataViewer>
    );
};

const JournalføringIkkeMuligModal: React.FC<{
    visModal: boolean;
    settVisModal: Dispatch<SetStateAction<boolean>>;
    erPapirSøknad: boolean;
}> = ({ visModal, settVisModal, erPapirSøknad }) => {
    return (
        <UIModalWrapper
            modal={{
                tittel: `Journalføring ikke mulig`,
                lukkKnapp: true,
                onClose: () => settVisModal(false),
                visModal: visModal,
            }}
        >
            <div>
                {erPapirSøknad ? (
                    <Normaltekst>
                        Foreløpig er det dessverre ikke mulig å journalføre på en eksisterende
                        behandling via journalføringsbildet når det ikke er tilknyttet en digital
                        søknad til journalposten.
                    </Normaltekst>
                ) : (
                    <Normaltekst>
                        Foreløpig er det dessverre ikke mulig å opprette en ny behandling via
                        journalføringsbildet når det ikke er tilknyttet en digital søknad til
                        journalposten. Gå inntil videre inn i behandlingsoversikten til bruker og
                        opprett ny behandling derifra. Deretter kan du journalføre mot den nye
                        behandlingen.
                    </Normaltekst>
                )}
            </div>
            <KnappWrapper>
                <Button
                    variant={'tertiary'}
                    className={'flex-item'}
                    onClick={() => {
                        settVisModal(false);
                    }}
                    children="Tilbake"
                />
            </KnappWrapper>
        </UIModalWrapper>
    );
};

const BekreftJournalføringModal: React.FC<{
    journalpostState: JournalføringStateRequest;
    journalpostId: string;
    innloggetSaksbehandler: ISaksbehandler;
}> = ({ journalpostState, journalpostId, innloggetSaksbehandler }) => {
    return (
        <UIModalWrapper
            modal={{
                tittel: ``,
                lukkKnapp: true,
                onClose: () => journalpostState.settVisBekreftelsesModal(false),
                visModal: journalpostState.visBekreftelsesModal,
            }}
        >
            <div>
                <Normaltekst>
                    Behandlingen du har valgt har allerede en digital søknad tilknyttet seg. Om du
                    skal gjennomføre en ny saksbehandling av søknaden må du opprette en ny
                    behandling.
                </Normaltekst>
            </div>
            <KnappWrapper>
                <Button
                    variant={'tertiary'}
                    className={'flex-item'}
                    onClick={() => {
                        journalpostState.settVisBekreftelsesModal(false);
                    }}
                    children="Tilbake"
                />
                <Button
                    variant={'primary'}
                    className={'flex-item'}
                    onClick={() => {
                        journalpostState.settVisBekreftelsesModal(false);
                        journalpostState.fullførJournalføring(
                            journalpostId,
                            innloggetSaksbehandler?.enhet || '9999',
                            innloggetSaksbehandler?.navIdent
                        );
                    }}
                    children="Journalfør allikevel"
                />
            </KnappWrapper>
        </UIModalWrapper>
    );
};
