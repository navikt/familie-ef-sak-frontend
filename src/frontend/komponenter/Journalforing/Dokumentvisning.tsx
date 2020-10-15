import EndreDokumentTittel from './EndreDokumentTittel';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { Systemtittel } from 'nav-frontend-typografi';
import VisDokumentTittel from './VisDokumentTittel';
import { IJournalpost } from '../../typer/journalforing';
import { OrNothing } from '../../hooks/felles/useSorteringState';

interface DokumentVisningProps {
    journalPost: IJournalpost;
    hentDokument: (dokumentInfoId: string) => void;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
    dokumentTitler?: Record<string, string>;
}

const StyledListe = styled.ul`
    min-width: 40vw;
    list-style: none;
    padding-left: 0;
`;

const StyledDiv = styled.div`
    margin-top: 1rem;
`;

const StyledListeElement = styled.li`
    line-height: 2rem;
    border-bottom: 1px solid #c6c2bf;
    padding: 0.5rem;
`;

const StyledDokumentRad = styled.div`
    display: flex;
    justify-content: space-between;
`;

const DokumentVisning: React.FC<DokumentVisningProps> = ({
    journalPost,
    hentDokument,
    dokumentTitler,
    settDokumentTitler,
}) => {
    const [dokumentForRedigering, settDokumentForRedigering] = useState<OrNothing<string>>();

    const endreDokumentNavn = (dokumentInfoId: string) => {
        return (nyttDokumentNavn: string) => {
            settDokumentTitler((prevState: Record<string, string> | undefined) => ({
                ...prevState,
                [dokumentInfoId]: nyttDokumentNavn,
            }));
            settDokumentForRedigering(null);
        };
    };

    return (
        <StyledDiv>
            <Systemtittel>Dokumenter</Systemtittel>
            <StyledListe>
                {journalPost.dokumenter.map((dokument) => (
                    <StyledListeElement key={dokument.dokumentInfoId}>
                        <StyledDokumentRad>
                            {dokumentForRedigering === dokument.dokumentInfoId ? (
                                <EndreDokumentTittel
                                    endreDokumentNavn={endreDokumentNavn(dokument.dokumentInfoId)}
                                    avbrytEndring={() => settDokumentForRedigering(null)}
                                />
                            ) : (
                                <VisDokumentTittel
                                    dokumentTittel={
                                        (dokumentTitler &&
                                            dokumentTitler[dokument.dokumentInfoId]) ||
                                        dokument.tittel
                                    }
                                    hentDokument={() => hentDokument(dokument.dokumentInfoId)}
                                    settDokumentForRedigering={() =>
                                        settDokumentForRedigering(dokument.dokumentInfoId)
                                    }
                                />
                            )}
                        </StyledDokumentRad>
                    </StyledListeElement>
                ))}
            </StyledListe>
        </StyledDiv>
    );
};

export default DokumentVisning;
