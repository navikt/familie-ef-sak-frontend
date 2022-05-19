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
    BehandlingRequest,
    JournalføringStateRequest,
    BarnSomSkalFødes,
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
import { ToggleName, Toggles } from '../../App/context/toggles';
import { IJojurnalpostResponse } from '../../App/typer/journalforing';
import VelgUstrukturertDokumentasjonType, {
    UstrukturertDokumentasjonType,
} from './VelgUstrukturertDokumentasjonType';

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

const Venstrekolonne = styled.div``;
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
    journalResponse.journalpost.dokumenter.every(
        (d) =>
            d.tittel ||
            (journalpostState.dokumentTitler && journalpostState.dokumentTitler[d.dokumentInfoId])
    );

const erUstrukturertSøknadOgManglerDokumentasjonsType = (
    journalResponse: IJojurnalpostResponse,
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined
) => !journalResponse.harStrukturertSøknad && !ustrukturertDokumentasjonType;

const inneholderBarnSomErUgyldige = (journalpostState: JournalføringStateRequest) =>
    journalpostState.barnSomSkalFødes.some(
        (barn) => !barn.fødselTerminDato || barn.fødselTerminDato.trim() === ''
    );

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
    const [ustrukturertDokumentasjonType, settUstrukturertDokumentasjonType] =
        useState<UstrukturertDokumentasjonType>();

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

    const skalBeOmBekreftelse = (
        behandling: BehandlingRequest | undefined,
        harStrukturertSøknad: boolean,
        ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined
    ) => {
        const erIkkeNyBehandling = behandling?.behandlingsId !== undefined;
        if (harStrukturertSøknad) {
            return erIkkeNyBehandling;
        } else if (toggles[ToggleName.kanLeggeTilTerminbarnVidJournalføring]) {
            // kan fjerne else når toggle fjernes
            const dokumentasjonErIkkePapirsøknad =
                ustrukturertDokumentasjonType !== UstrukturertDokumentasjonType.PAPIRSØKNAD;
            return erIkkeNyBehandling && dokumentasjonErIkkePapirsøknad;
        } else {
            return !erIkkeNyBehandling;
        }
    };

    const oppdaterBarnSomSkalFødes = (barnSomSkalFødes: BarnSomSkalFødes[]) => {
        journalpostState.settBarnSomSkalFødes(barnSomSkalFødes);
    };

    const kanLeggeTilBarnSomSkalFødes = () => {
        const erNyBehandling =
            journalpostState.behandling && !journalpostState.behandling.behandlingsId;
        const harIkkeStrukturertSøknad =
            journalResponse.status === RessursStatus.SUKSESS &&
            !journalResponse.data.harStrukturertSøknad;
        return (
            toggles[ToggleName.kanLeggeTilTerminbarnVidJournalføring] &&
            erNyBehandling &&
            harIkkeStrukturertSøknad &&
            ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.PAPIRSØKNAD
        );
    };

    return (
        <DataViewer response={{ journalResponse }}>
            {({ journalResponse }) => (
                <SideLayout className={'container'}>
                    <Sidetittel>{`Registrere journalpost${
                        journalResponse.journalpost.behandlingstema
                            ? ': ' +
                              behandlingstemaTilTekst[journalResponse.journalpost.behandlingstema]
                            : ''
                    }`}</Sidetittel>
                    <Kolonner>
                        <Venstrekolonne>
                            <UtledEllerVelgFagsak
                                journalResponse={journalResponse}
                                hentFagsak={hentFagsak}
                            />
                            {!journalResponse.harStrukturertSøknad && (
                                <VelgUstrukturertDokumentasjonType
                                    ustrukturertDokumentasjonType={ustrukturertDokumentasjonType}
                                    settUstrukturertDokumentasjonType={
                                        settUstrukturertDokumentasjonType
                                    }
                                />
                            )}
                            <Brukerinfo personIdent={journalResponse.personIdent} />
                            <DokumentVisning
                                journalPost={journalResponse.journalpost}
                                hentDokument={hentDokument}
                                dokumentTitler={journalpostState.dokumentTitler}
                                settDokumentTitler={journalpostState.settDokumentTitler}
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
                                        oppdaterBarnSomSkalFødes={oppdaterBarnSomSkalFødes}
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
                                        if (
                                            erUstrukturertSøknadOgManglerDokumentasjonsType(
                                                journalResponse,
                                                ustrukturertDokumentasjonType
                                            )
                                        ) {
                                            settFeilMeldning('Mangler type dokumentasjon');
                                        } else if (inneholderBarnSomErUgyldige(journalpostState)) {
                                            settFeilMeldning(
                                                'Et eller flere barn mangler gyldig dato'
                                            );
                                        } else if (
                                            !harTittelForAlleDokumenter(
                                                journalResponse,
                                                journalpostState
                                            )
                                        ) {
                                            settFeilMeldning(
                                                'Mangler tittel på et eller flere dokumenter'
                                            );
                                        } else if (
                                            skalBeOmBekreftelse(
                                                journalpostState.behandling,
                                                journalResponse.harStrukturertSøknad,
                                                ustrukturertDokumentasjonType
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
                                        journalpostState.innsending.status === RessursStatus.HENTER
                                    }
                                >
                                    Journalfør
                                </Hovedknapp>
                            </FlexKnapper>
                        </Venstrekolonne>
                        <Høyrekolonne>
                            <FlexKnapper>
                                <Knapp
                                    onClick={() => hentForrigeDokument(journalResponse.journalpost)}
                                    mini
                                >
                                    Forrige Dokument
                                </Knapp>
                                <Knapp
                                    onClick={() => hentNesteDokument(journalResponse.journalpost)}
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
                        toggles={toggles}
                    />
                </SideLayout>
            )}
        </DataViewer>
    );
};

const JournalføringIkkeMuligModal: React.FC<{
    visModal: boolean;
    settVisModal: Dispatch<SetStateAction<boolean>>;
    toggles: Toggles;
}> = ({ visModal, settVisModal, toggles }) => {
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
                {toggles[ToggleName.kanLeggeTilTerminbarnVidJournalføring] ? (
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
