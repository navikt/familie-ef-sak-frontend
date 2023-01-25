import React from 'react';
import { Collapse, Expand } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { useEkspanderbareVilkårpanelContext } from '../../../../App/context/EkspanderbareVilkårpanelContext';
import styled from 'styled-components';

const KnappeWrapper = styled.div`
    display: flex;
    gap: 1rem;
    margin-left: auto;
`;
export const ÅpneOgLukkePanelKnapper: React.FC = () => {
    const { åpneAlle, lukkAlle } = useEkspanderbareVilkårpanelContext();
    return (
        <KnappeWrapper>
            <Button variant="tertiary" icon={<Collapse />} size="small" onClick={lukkAlle}>
                Lukk alle
            </Button>
            <Button variant="tertiary" icon={<Expand />} size="small" onClick={åpneAlle}>
                Åpne alle
            </Button>
        </KnappeWrapper>
    );
};
