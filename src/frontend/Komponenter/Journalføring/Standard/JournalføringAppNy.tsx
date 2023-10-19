import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../../App/hooks/useJournalføringState';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { useApp } from '../../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../../Oppgavebenk/oppgavefilterStorage';
import { Heading } from '@navikt/ds-react';
import JournalføringWrapper, {
    Høyrekolonne,
    JournalføringAppProps,
    Kolonner,
    Venstrekolonne,
} from '../Felles/JournalføringWrapper';
import JournalføringPdfVisning from '../Felles/JournalføringPdfVisning';
import JournalpostPanel from './JournalpostPanel';
import BrukerPanel from './BrukerPanel';
import AvsenderPanel from './AvsenderPanel';
import Dokumenter from './Dokumenter';

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.5rem;
`;

export const JournalføringAppNy: React.FC = () => {
    return <JournalføringWrapper komponent={JournalføringSide} />;
};

const JournalføringSide: React.FC<JournalføringAppProps> = ({ oppgaveId, journalResponse }) => {
    const { innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();
    const journalpostState: JournalføringStateRequest = useJournalføringState(
        journalResponse,
        oppgaveId
    );

    const { fagsak } = useHentFagsak();

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

    return (
        <Kolonner>
            <Venstrekolonne>
                <InnerContainer>
                    <section>
                        <Tittel size={'medium'} level={'1'}>
                            Journalføring
                        </Tittel>
                        <JournalpostPanel
                            journalpost={journalResponse.journalpost}
                            journalpostState={journalpostState}
                        />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Dokumenter
                        </Tittel>
                        <Dokumenter
                            journalpost={journalResponse.journalpost}
                            journalpostState={journalpostState}
                        />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Bruker
                        </Tittel>
                        <BrukerPanel journalpostResponse={journalResponse} />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Avsender
                        </Tittel>
                        <AvsenderPanel journalpostResponse={journalResponse} />
                    </section>
                </InnerContainer>
            </Venstrekolonne>
            <Høyrekolonne>
                <JournalføringPdfVisning
                    hentDokumentResponse={journalpostState.hentDokumentResponse}
                />
            </Høyrekolonne>
        </Kolonner>
    );
};
