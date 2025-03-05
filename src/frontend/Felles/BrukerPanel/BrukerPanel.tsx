import React from 'react';
import { Panel } from '@navikt/ds-react';
import { PanelHeader, PanelHeaderType } from './PanelHeader';

interface Props {
    navn: string;
    personIdent: string;
    type: PanelHeaderType;
    onClick?: () => void;
    className?: string;
}

export const BrukerPanel: React.FC<Props> = ({ navn, personIdent, type, onClick, className }) => (
    <Panel className={className} border>
        <PanelHeader navn={navn} personIdent={personIdent} type={type} onClick={onClick} />
    </Panel>
);
