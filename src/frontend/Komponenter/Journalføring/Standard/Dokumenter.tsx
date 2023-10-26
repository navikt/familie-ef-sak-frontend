import React from 'react';
import styled from 'styled-components';
import { IJournalpost } from '../../../App/typer/journalføring';
import DokumentPanel from './DokumentPanel';
import { JournalføringStateRequest } from '../../../App/hooks/useJournalføringState';

const Liste = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
`;

interface Props {
    journalpost: IJournalpost;
    journalpostState: JournalføringStateRequest;
}

const Dokumenter: React.FC<Props> = ({ journalpost, journalpostState }) => {
    return (
        <Liste>
            {journalpost.dokumenter.map((dokument) => (
                <li key={dokument.dokumentInfoId}>
                    <DokumentPanel
                        dokument={dokument}
                        hentDokument={journalpostState.hentDokumentResponse.hentDokument}
                        journalpost={journalpost}
                        journalpostState={journalpostState}
                    />
                </li>
            ))}
        </Liste>
    );
};

export default Dokumenter;
