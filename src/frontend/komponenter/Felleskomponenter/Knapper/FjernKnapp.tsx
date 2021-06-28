import { Delete } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { Flatknapp } from 'nav-frontend-knapper';
import hiddenIf from '../HiddenIf/hiddenIf';

const StyledKnapp = styled(Flatknapp)`
    padding: 0;
    margin-left: 1rem;
`;

const FjernKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <StyledKnapp onClick={onClick} id="ting">
            <Delete />
            <span className="sr-only">{knappetekst}</span>
        </StyledKnapp>
    );
};

export default hiddenIf(FjernKnapp);
