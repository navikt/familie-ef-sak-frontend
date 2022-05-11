import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { RessursStatus } from '../../App/typer/ressurs';
import styled from 'styled-components';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import Brukerinfo from './Brukerinfo';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from './Dokumentvisning';
import { behandlingstemaTilTekst } from '../../App/typer/behandlingstema';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Select, SkjemaGruppe } from 'nav-frontend-skjema';
import {
    BehandlingRequest,
    JournalføringStateRequest,
    Terminbarn,
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
import LeggTilTerminbarn from './LeggTilTerminbarn';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

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

const VelgUstrukturertDokumentasjonType = styled(Select)`
    width: 10rem;
    margin: 1rem 0;
`;

enum UstrukturertDokumentasjonType {
    SØKNAD = 'SØKNAD',
    ETTERSENDING = 'ETTERSENDNING',
}

const ustrukturertTypeTilTekst: Record<UstrukturertDokumentasjonType, string> = {
    SØKNAD: 'Søknad',
    ETTERSENDNING: 'Ettersendning',
};

const Venstrekolonne = styled.div``;
const Høyrekolonne = styled.div``;
const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const JOURNALPOST_QUERY_STRING = 'journalpostId';
const OPPGAVEID_QUERY_STRING = 'oppgaveId';

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
        const erIkkeNySøknad = behandling?.behandlingsId !== undefined;
        if (harStrukturertSøknad) {
            return erIkkeNySøknad;
        } else {
            const dokumentasjonErIkkeSøknad =
                ustrukturertDokumentasjonType !== UstrukturertDokumentasjonType.SØKNAD;
            return erIkkeNySøknad && dokumentasjonErIkkeSøknad;
        }
    };

    const oppdaterTerminbarn = (terminbarn: Terminbarn[]) => {
        journalpostState.settTerminbarn(terminbarn);
    };

    const kanLeggeTilTerminbarn = () => {
        const erNyBehandling =
            journalpostState.behandling && !journalpostState.behandling.behandlingsId;
        const harIkkeStrukturertSøknad =
            journalResponse.status === RessursStatus.SUKSESS &&
            !journalResponse.data.harStrukturertSøknad;
        return (
            toggles[ToggleName.kanLeggeTilTerminbarnVidJournalføring] &&
            erNyBehandling &&
            harIkkeStrukturertSøknad
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
                                    label="Type dokumentasjon"
                                    onChange={(e) => {
                                        if (e.target.value.trim() !== '') {
                                            settUstrukturertDokumentasjonType(
                                                e.target.value as UstrukturertDokumentasjonType
                                            );
                                        } else {
                                            settUstrukturertDokumentasjonType(undefined);
                                        }
                                    }}
                                    value={ustrukturertDokumentasjonType}
                                >
                                    <option value={''}>Ikke valgt</option>
                                    {[
                                        UstrukturertDokumentasjonType.SØKNAD,
                                        UstrukturertDokumentasjonType.ETTERSENDING,
                                    ].map((type) => (
                                        <option key={type} value={type}>
                                            {ustrukturertTypeTilTekst[type]}
                                        </option>
                                    ))}
                                </VelgUstrukturertDokumentasjonType>
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
                                {kanLeggeTilTerminbarn() && (
                                    <LeggTilTerminbarn
                                        terminbarn={journalpostState.terminbarn}
                                        oppdaterTerminbarn={oppdaterTerminbarn}
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
                                            !journalResponse.harStrukturertSøknad &&
                                            !ustrukturertDokumentasjonType
                                        ) {
                                            settFeilMeldning('Mangler type dokumentasjon');
                                        } else if (
                                            journalpostState.terminbarn.some(
                                                (t) =>
                                                    !t.fødselTerminDato ||
                                                    t.fødselTerminDato.trim() === ''
                                            )
                                        ) {
                                            settFeilMeldning(
                                                'Et eller flere terminbarn mangler gyldig dato'
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
                    />
                </SideLayout>
            )}
        </DataViewer>
    );
};

const JournalføringIkkeMuligModal: React.FC<{
    visModal: boolean;
    settVisModal: Dispatch<SetStateAction<boolean>>;
}> = ({ visModal, settVisModal }) => {
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
                <Normaltekst>
                    Foreløpig er det dessverre ikke mulig å journalføre på en eksisterende
                    behandling via journalføringsbildet når det ikke er tilknyttet en digital søknad
                    til journalposten.
                </Normaltekst>
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
