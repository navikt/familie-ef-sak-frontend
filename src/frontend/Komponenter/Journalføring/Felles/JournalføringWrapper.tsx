import React, { FunctionComponent, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useQueryParams } from '../../../App/hooks/felles/useQueryParams';
import {
    GJELDER_KLAGE_QUERY_STRING,
    JOURNALPOST_QUERY_STRING,
    OPPGAVEID_QUERY_STRING,
} from './utils';
import { useHentJournalpost } from '../../../App/hooks/useHentJournalpost';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import styled from 'styled-components';

export const Kolonner = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
`;

export const Venstrekolonne = styled.div`
    padding: 1rem 2rem 1rem 2rem;
    height: inherit;
    overflow: auto;
    @media (min-width: 1225px) {
        height: calc(100vh - 4rem);
        max-width: 750px;
    }
`;
export const Høyrekolonne = styled.div`
    display: flex;
    flex: 1 1 auto;
    min-width: 450px;
    height: calc(100vh - 4rem);
`;

export interface JournalføringSideProps {
    oppgaveId: string;
    gjelderKlage: boolean;
    journalResponse: IJournalpostResponse;
}

interface Props {
    komponent: FunctionComponent<JournalføringSideProps>;
}

const JournalføringWrapper: React.FC<Props> = ({ komponent }) => {
    const query: URLSearchParams = useQueryParams();
    const oppgaveId = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostId = query.get(JOURNALPOST_QUERY_STRING);
    const gjelderKlage = query.get(GJELDER_KLAGE_QUERY_STRING) === 'true';

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
                            gjelderKlage,
                        })}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default JournalføringWrapper;
