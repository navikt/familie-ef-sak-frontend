import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../../App/hooks/useJournalføringState';
import { useHentDokument } from '../../../App/hooks/useHentDokument';
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

    const journalpostId = journalResponse.journalpost.journalpostId;

    const journalpostState: JournalføringStateRequest = useJournalføringState(
        journalResponse,
        oppgaveId,
        journalpostId
    );
    const hentDokumentResponse = useHentDokument(journalResponse.journalpost);

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
                </InnerContainer>
            </Venstrekolonne>
            <Høyrekolonne>
                <JournalføringPdfVisning hentDokumentResponse={hentDokumentResponse} />
            </Høyrekolonne>
        </Kolonner>
    );
};
