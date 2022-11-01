import EndreDokumentTittel from './EndreDokumentTittel';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { Systemtittel } from 'nav-frontend-typografi';
import VisDokumentTittel from './VisDokumentTittel';
import { IJournalpost } from '../../App/typer/journalføring';
import { OrNothing } from '../../App/hooks/felles/useSorteringState';

interface DokumentVisningProps {
    journalPost: IJournalpost;
    hentDokument: (dokumentInfoId: string) => void;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
    dokumentTitler?: Record<string, string>;
    erPapirsøknad: boolean;
}

const StyledListe = styled.ul`
    min-width: 40vw;
    list-style: none;
    padding-left: 0;
`;

const StyledDokumentWrapper = styled.div`
    margin-top: 1rem;
`;

const StyledListeElement = styled.li`
    line-height: 2rem;
    border-bottom: 1px solid #c6c2bf;
    padding: 0.5rem;
`;

const DokumentVisning: React.FC<DokumentVisningProps> = ({
    journalPost,
    hentDokument,
    dokumentTitler,
    settDokumentTitler,
    erPapirsøknad,
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
        <StyledDokumentWrapper>
            <Systemtittel>Dokumenter</Systemtittel>
            <StyledListe>
                {journalPost.dokumenter.map((dokument) => (
                    <StyledListeElement key={dokument.dokumentInfoId}>
                        {dokumentForRedigering === dokument.dokumentInfoId ? (
                            <EndreDokumentTittel
                                endreDokumentNavn={endreDokumentNavn(dokument.dokumentInfoId)}
                                avbrytEndring={() => settDokumentForRedigering(null)}
                            />
                        ) : (
                            <VisDokumentTittel
                                dokumentTittel={
                                    (dokumentTitler && dokumentTitler[dokument.dokumentInfoId]) ||
                                    dokument.tittel
                                }
                                hentDokument={() => hentDokument(dokument.dokumentInfoId)}
                                settDokumentForRedigering={() =>
                                    settDokumentForRedigering(dokument.dokumentInfoId)
                                }
                                logiskeVedlegg={erPapirsøknad ? dokument.logiskeVedlegg : []}
                            />
                        )}
                    </StyledListeElement>
                ))}
            </StyledListe>
        </StyledDokumentWrapper>
    );
};

export default DokumentVisning;
