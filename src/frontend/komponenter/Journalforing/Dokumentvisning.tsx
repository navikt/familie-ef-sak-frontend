import EndreDokumentTittel from './EndreDokumentTittel';
import React, { useState } from 'react';
import { IJournalpost } from './journalforing';
import { OrNothing } from '../../hooks/useSorteringState';
import styled from 'styled-components';
import { Systemtittel } from 'nav-frontend-typografi';
import VisDokumentTittel from './VisDokumentTittel';

interface DokumentVisningProps {
    journalPost: IJournalpost;
    hentDokument: (dokumentInfoId: string) => void;
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

const DokumentVisning: React.FC<DokumentVisningProps> = ({ journalPost, hentDokument }) => {
    const [journalPostKopi, settJournalPostKopi] = useState<IJournalpost>(journalPost);

    const [dokumentForRedigering, settDokumentForRedigering] = useState<OrNothing<string>>();

    const endreDokumentNavn = (dokumentInfoId: string) => {
        return (nyttDokumentNavn: string) => {
            settJournalPostKopi({
                ...journalPostKopi,
                dokumenter: journalPostKopi.dokumenter.map((dokument) => {
                    if (dokument.dokumentInfoId === dokumentInfoId) {
                        return { ...dokument, tittel: nyttDokumentNavn };
                    }
                    return dokument;
                }),
            });
            settDokumentForRedigering(null);
        };
    };

    return (
        <StyledDiv>
            <Systemtittel>Dokumenter</Systemtittel>
            <StyledListe>
                {journalPostKopi.dokumenter.map((dokument) => (
                    <StyledListeElement key={dokument.dokumentInfoId}>
                        <StyledDokumentRad>
                            {dokumentForRedigering === dokument.dokumentInfoId ? (
                                <EndreDokumentTittel
                                    endreDokumentNavn={endreDokumentNavn(dokument.dokumentInfoId)}
                                    avbrytEndring={() => settDokumentForRedigering(null)}
                                />
                            ) : (
                                <VisDokumentTittel
                                    dokumentTittel={dokument.tittel}
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
