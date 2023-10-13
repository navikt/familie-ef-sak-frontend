import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { IJournalpost } from '../../../App/typer/journalføring';
import DokumentPanel from './DokumentPanel';

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
    hentDokument: (dokumentInfoId: string) => void;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
}

const Dokumenter: React.FC<Props> = ({ journalpost, hentDokument, settDokumentTitler }) => {
    return (
        <Liste>
            {journalpost.dokumenter.map((dokument) => (
                <li>
                    <DokumentPanel
                        key={dokument.dokumentInfoId}
                        dokument={dokument}
                        journalpost={journalpost}
                        hentDokument={hentDokument}
                        settDokumentTitler={settDokumentTitler}
                    />
                </li>
            ))}
        </Liste>
    );
};

export default Dokumenter;
