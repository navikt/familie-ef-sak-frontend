import { Delete } from '@navikt/ds-icons';
import React from 'react';
import { Flatknapp } from 'nav-frontend-knapper';
import hiddenIf from '../HiddenIf/hiddenIf';
import styled from 'styled-components';

const StyledKnapp = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 0.25rem;
`;

const FjernKnapp: React.FC<{ onClick: () => void; knappetekst: string }> = ({
    onClick,
    knappetekst,
}) => {
    return (
        <StyledKnapp onClick={onClick} htmlType="button">
            <Delete />
            <span className="sr-only">{knappetekst}</span>
        </StyledKnapp>
    );
};

export default hiddenIf(FjernKnapp);
