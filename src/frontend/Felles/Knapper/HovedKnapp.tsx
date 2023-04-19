import React from 'react';
import { Button } from '@navikt/ds-react';
import styled from 'styled-components';

export const Knapp = styled(Button)`
    width: fit-content;
`;

const HovedKnapp: React.FC<{
    className?: string;
    disabled?: boolean;
    knappetekst?: string;
    onClick?: () => void;
}> = ({ className, disabled, knappetekst, onClick }) => {
    return (
        <Knapp
            className={className}
            disabled={disabled}
            onClick={onClick}
            type="submit"
            variant="primary"
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default HovedKnapp;
