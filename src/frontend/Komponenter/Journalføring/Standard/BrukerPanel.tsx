import React from 'react';
import { Panel } from '@navikt/ds-react';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { PanelHeader, PanelHeaderType } from './PanelHeader';

interface Props {
    journalpostResponse: IJournalpostResponse;
}

const BrukerPanel: React.FC<Props> = ({ journalpostResponse }) => {
    const { navn, personIdent } = journalpostResponse;

    return (
        <Panel border>
            <PanelHeader navn={navn} personIdent={personIdent} type={PanelHeaderType.Bruker} />
        </Panel>
    );
};

export default BrukerPanel;
