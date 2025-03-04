import React from 'react';
import { Panel } from '@navikt/ds-react';
import { PanelHeader, PanelHeaderType } from './PanelHeader';

interface Props {
    navn: string;
    personIdent: string;
    type: PanelHeaderType;
    onClick?: () => void;
}

export const BrukerPanel: React.FC<Props> = ({ navn, personIdent, type, onClick }) => (
    <Panel border>
        <PanelHeader navn={navn} personIdent={personIdent} type={type} onClick={onClick} />
    </Panel>
);
