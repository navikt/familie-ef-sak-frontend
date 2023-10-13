import React from 'react';
import { Panel } from '@navikt/ds-react';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { BrukerPanelHeader } from './BrukerPanelHeader';

interface Props {
    journalpostResponse: IJournalpostResponse;
}

const BrukerPanel: React.FC<Props> = ({ journalpostResponse }) => {
    return (
        <Panel border>
            <BrukerPanelHeader
                navn={journalpostResponse.navn}
                personIdent={journalpostResponse.personIdent}
            />
        </Panel>
    );
};

export default BrukerPanel;
