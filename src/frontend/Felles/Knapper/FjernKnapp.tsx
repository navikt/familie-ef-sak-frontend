import { Delete } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const FjernKnapp: React.FC<{
    onClick: () => void;
    knappetekst?: string;
    ikontekst?: string;
}> = ({ onClick, knappetekst, ikontekst }) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<Delete title={knappetekst ? knappetekst : ikontekst} />}
            style={{ alignItems: 'start' }}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default FjernKnapp;
