import { Cancel } from '@navikt/ds-icons';
import React from 'react';
import hiddenIf from '../HiddenIf/hiddenIf';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';

const StyledKnapp = styled(Button)`
    margin-bottom: 0.25rem;
`;

const TilbakestillKnapp: React.FC<{
    onClick: () => void;
    knappetekst: string;
    visKnapptekst?: boolean;
}> = ({ onClick, knappetekst, visKnapptekst }) => {
    return (
        <StyledKnapp
            onClick={onClick}
            type="button"
            variant={visKnapptekst ? 'secondary' : 'tertiary'}
            icon={
                <Cancel>
                    {!visKnapptekst && <span className={'sr-only'}>{knappetekst}</span>}
                </Cancel>
            }
        >
            {visKnapptekst && <span>{knappetekst}</span>}
        </StyledKnapp>
    );
};

export default hiddenIf(TilbakestillKnapp);
