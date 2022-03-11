import React, { useEffect, useState } from 'react';
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
import { SkjemaGruppe } from 'nav-frontend-skjema';
import {
    BehandlingRequest,
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

export const JournalforingApp: React.FC = () => {
    const { innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();
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

    const skalBeOmBekreftelse = (
        behandling: BehandlingRequest | undefined,
        harStrukturertSøknad: boolean
    ) => {
        if (harStrukturertSøknad) {
            return behandling?.behandlingsId !== undefined;
        } else {
            return behandling?.behandlingsId === undefined;
        }
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
                                            skalBeOmBekreftelse(
                                                journalpostState.behandling,
                                                journalResponse.harStrukturertSøknad
                                            )
                                        ) {
                                            journalpostState.settVisBekreftelsesModal(true);
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
                    <UIModalWrapper
                        modal={{
                            tittel: `Bekreft journalføring`,
                            lukkKnapp: true,
                            onClose: () => journalpostState.settVisBekreftelsesModal(false),
                            visModal: journalpostState.visBekreftelsesModal,
                        }}
                    >
                        <div>
                            {journalResponse.harStrukturertSøknad && (
                                <Normaltekst>
                                    Behandlingen du har valgt har allerede en digital søknad
                                    tilknyttet seg. Om du skal gjennomføre en ny saksbehandling av
                                    søknaden må du opprette en ny behandling.
                                </Normaltekst>
                            )}
                            {!journalResponse.harStrukturertSøknad && (
                                <Normaltekst>
                                    Det finnes ingen digital søknad tilknyttet journalposten og den
                                    bør derfor journalføres på en eksisterende behandling
                                </Normaltekst>
                            )}
                        </div>
                        <KnappWrapper>
                            <Knapp
                                type={'hoved'}
                                className={'flex-item'}
                                onClick={() => {
                                    journalpostState.settVisBekreftelsesModal(false);
                                }}
                                children="Tilbake"
                            />

                            <Knapp
                                type={'standard'}
                                className={'flex-item'}
                                onClick={() => {
                                    journalpostState.settVisBekreftelsesModal(false);
                                    journalpostState.fullførJournalføring(
                                        journalpostIdParam,
                                        innloggetSaksbehandler?.enhet || '9999',
                                        innloggetSaksbehandler?.navIdent
                                    );
                                }}
                                children="Journalfør allikevel"
                            />
                        </KnappWrapper>
                    </UIModalWrapper>
                </SideLayout>
            )}
        </DataViewer>
    );
};
