import EndreDokumentTittel from './EndreDokumentTittel';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import VisDokumentTittel from './VisDokumentTittel';
import { IJournalpost } from '../../App/typer/journalføring';
import { OrNothing } from '../../App/hooks/felles/useSorteringState';
import { Heading } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

interface DokumentVisningProps {
    journalPost: IJournalpost;
    hentDokument: (dokumentInfoId: string) => void;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
    dokumentTitler?: Record<string, string>;
    erPapirsøknad: boolean;
}

const Liste = styled.ul`
    min-width: 30vw;
    list-style: none;
    padding-left: 0;
    margin-top: 0;
`;

const Container = styled.div`
    margin-top: 1rem;
`;

const ListeRad = styled.li`
    line-height: 2rem;
    border-bottom: 1px solid ${ABorderDivider};
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
        <Container>
            <Heading size={'medium'} level={'2'}>
                Dokumenter
            </Heading>
            <Liste>
                {journalPost.dokumenter.map((dokument) => (
                    <ListeRad key={dokument.dokumentInfoId}>
                        {dokumentForRedigering === dokument.dokumentInfoId ? (
                            <EndreDokumentTittel
                                endreDokumentNavn={endreDokumentNavn(dokument.dokumentInfoId)}
                                avbrytEndring={() => settDokumentForRedigering(null)}
                            />
                        ) : (
                            <VisDokumentTittel
                                journalPostId={journalPost.journalpostId}
                                dokumentInfo={dokument}
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
                    </ListeRad>
                ))}
            </Liste>
        </Container>
    );
};

export default DokumentVisning;
