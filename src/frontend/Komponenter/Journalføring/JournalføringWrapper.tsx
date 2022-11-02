import React, { FunctionComponent, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useQueryParams } from '../../App/hooks/felles/useQueryParams';
import { JOURNALPOST_QUERY_STRING, OPPGAVEID_QUERY_STRING } from './journalføringUtil';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { IJojurnalpostResponse } from '../../App/typer/journalføring';
import styled from 'styled-components';

export const SideLayout = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: 2rem;
`;

export const Kolonner = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`;

export const Venstrekolonne = styled.div`
    max-width: 900px;
`;
export const Høyrekolonne = styled.div``;
export const FlexKnapper = styled.div`
    margin: 1rem;
    display: flex;
    justify-content: space-between;
`;

export interface JournalføringAppProps {
    oppgaveId: string;
    journalResponse: IJojurnalpostResponse;
}

interface JournalføringAppSide {
    komponent: FunctionComponent<JournalføringAppProps>;
}

const JournalføringWrapper: React.FC<JournalføringAppSide> = ({ komponent }) => {
    const query: URLSearchParams = useQueryParams();
    const oppgaveId = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostId = query.get(JOURNALPOST_QUERY_STRING);

    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostId);

    useEffect(() => {
        hentJournalPost();
    }, [hentJournalPost]);

    useEffect(() => {
        document.title = 'Journalpost';
    }, []);

    if (!oppgaveId || !journalpostId) {
        return <Navigate to="/oppgavebenk" />;
    }

    return (
        <DataViewer response={{ journalResponse }}>
            {({ journalResponse }) => {
                return (
                    <>
                        {React.createElement(komponent, {
                            oppgaveId,
                            journalResponse,
                        })}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default JournalføringWrapper;
