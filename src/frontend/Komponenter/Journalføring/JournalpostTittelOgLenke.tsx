import { Heading } from '@navikt/ds-react';
import React from 'react';
import { IJojurnalpostResponse } from '../../App/typer/journalføring';
import styled from 'styled-components';
import { lagJournalføringKlageUrl, lagJournalføringUrl } from './journalføringUtil';
import { Link } from 'react-router-dom';

const Container = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
`;

const JournalpostTittelOgLenke: React.FC<{
    journalResponse: IJojurnalpostResponse;
    oppgaveId: string;
    fra: 'klage' | 'vanlig';
}> = ({ journalResponse, oppgaveId, fra }) => {
    const journalpost = journalResponse.journalpost;
    const journalpostId = journalpost.journalpostId;
    return (
        <Container>
            <div>
                <Heading size={'small'} level={'2'}>
                    Journalposttittel
                </Heading>
                <Heading size={'xsmall'} level={'3'}>
                    {journalpost.tittel}
                </Heading>
            </div>
            {!journalResponse.harStrukturertSøknad &&
                (fra === 'klage' ? (
                    <Link to={lagJournalføringUrl(journalpostId, oppgaveId)}>
                        Journalføringen gjelder ikke en klage
                    </Link>
                ) : (
                    <Link to={lagJournalføringKlageUrl(journalpostId, oppgaveId)}>
                        Journalføringen gjelder en klage
                    </Link>
                ))}
        </Container>
    );
};
export default JournalpostTittelOgLenke;
