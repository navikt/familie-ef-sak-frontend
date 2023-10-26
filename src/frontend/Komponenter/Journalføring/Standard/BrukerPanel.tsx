import React from 'react';
import { Panel } from '@navikt/ds-react';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { BrukerPanelHeader } from './BrukerPanelHeader';

interface Props {
    journalpostResponse: IJournalpostResponse;
}

const BrukerPanel: React.FC<Props> = ({ journalpostResponse }) => {
    const { navn, personIdent } = journalpostResponse;

    return (
        <Panel border>
            <BrukerPanelHeader navn={navn} personIdent={personIdent} />
        </Panel>
    );
};

export default BrukerPanel;
