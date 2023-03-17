import { Delete } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';
import styled from 'styled-components';

const Knapp = styled(Button)`
    width: fit-content;
`;

const FjernKnapp: React.FC<{
    className?: string;
    ikontekst?: string;
    knappetekst?: string;
    onClick: () => void;
}> = ({ className, ikontekst, knappetekst, onClick }) => {
    return (
        <Knapp
            className={className}
            icon={<Delete title={knappetekst ? knappetekst : ikontekst} />}
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default FjernKnapp;
