import React from 'react';
import { Box } from '@navikt/ds-react';
import { PanelHeader, PanelHeaderType } from './PanelHeader';

interface Props {
    navn: string;
    personIdent: string;
    type: PanelHeaderType;
    onClick?: () => void;
    width?: string;
}

export const BrukerPanel: React.FC<Props> = ({ navn, personIdent, type, onClick, width }) => (
    <Box borderWidth="1" width={width} paddingBlock="space-16 space-16" padding="space-12">
        <PanelHeader navn={navn} personIdent={personIdent} type={type} onClick={onClick} />
    </Box>
);
