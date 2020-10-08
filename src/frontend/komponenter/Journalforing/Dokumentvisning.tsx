import EndreDokumentTittel from './EndreDokumentTittel';
import { Flatknapp } from 'nav-frontend-knapper';
import Rediger from '../../ikoner/Rediger';
import React, { useState } from 'react';
import VisPdf from '../../ikoner/VisPdf';
import { IJournalpost } from './journalforing';
import { OrNothing } from '../../hooks/useSorteringState';
import styled from 'styled-components';

interface DokumentVisningProps {
    journalPost: IJournalpost;
    hentDokument: (dokumentInfoId: string) => void;
}

const StyledListe = styled.ul`
    min-width: 40vw;
    list-style: none;
    padding-left: 0;
`;

const StyledListeElement = styled.li`
    line-height: 2rem;
    border-bottom: 2px solid;
    padding: 0.5rem;
`;

const StyledKnapper = styled.ul``;

const StyledDokumentRad = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledFlatKnapp = styled(Flatknapp)`
    margin-right: 0.25rem;
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
                            <>
                                <span>{dokument.tittel} YO</span>
                                <StyledKnapper>
                                    <StyledFlatKnapp
                                        kompakt={true}
                                        onClick={() =>
                                            settDokumentForRedigering((prevState) => {
                                                if (prevState) {
                                                    return undefined;
                                                }
                                                return dokument.dokumentInfoId;
                                            })
                                        }
                                    >
                                        <Rediger />
                                    </StyledFlatKnapp>
                                    <StyledFlatKnapp
                                        kompakt={true}
                                        onClick={() => hentDokument(dokument.dokumentInfoId)}
                                    >
                                        <VisPdf />
                                    </StyledFlatKnapp>
                                </StyledKnapper>
                            </>
                        )}
                    </StyledDokumentRad>
                </StyledListeElement>
            ))}
        </StyledListe>
    );
};

export default DokumentVisning;
