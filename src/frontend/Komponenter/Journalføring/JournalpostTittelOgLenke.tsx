import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { IJournalpost } from '../../App/typer/journalføring';
import styled from 'styled-components';
import { lagJournalføringKlageUrl, lagJournalføringUrl } from './journalføringUtil';
import { Link } from 'react-router-dom';

const TittelOgLink = styled.div`
    display: flex;
    justify-content: space-between;
`;

const JournalpostTittelOgLenke: React.FC<{
    journalpost: IJournalpost;
    oppgaveId: string;
    visLenke: boolean;
    fra: 'klage' | 'vanlig';
}> = ({ journalpost, oppgaveId, visLenke, fra }) => {
    const journalpostId = journalpost.journalpostId;
    return (
        <TittelOgLink>
            <div>
                <Label>Journalposttittel</Label>
                <BodyShort>{journalpost.tittel}</BodyShort>
            </div>
            {visLenke &&
                (fra === 'klage' ? (
                    <Link to={lagJournalføringUrl(journalpostId, oppgaveId)}>
                        Journalføringen gjelder ikke en klage
                    </Link>
                ) : (
                    <Link to={lagJournalføringKlageUrl(journalpostId, oppgaveId)}>
                        Journalføringen gjelder en klage
                    </Link>
                ))}
        </TittelOgLink>
    );
};
export default JournalpostTittelOgLenke;
