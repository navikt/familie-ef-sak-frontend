import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import styled from 'styled-components';

const KnappeWrapper = styled.div`
    display: flex;
    gap: 1rem;
    margin-left: auto;
`;

interface Props {
    lukkAlle: () => void;
    åpneAlle: () => void;
}
export const ÅpneOgLukkePanelKnapper: React.FC<Props> = ({ lukkAlle, åpneAlle }) => {
    return (
        <KnappeWrapper>
            <Button variant="tertiary" icon={<ChevronUpIcon />} size="small" onClick={lukkAlle}>
                Lukk alle
            </Button>
            <Button variant="tertiary" icon={<ChevronDownIcon />} size="small" onClick={åpneAlle}>
                Åpne alle
            </Button>
        </KnappeWrapper>
    );
};
