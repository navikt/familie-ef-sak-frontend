import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const LeggTilKnapp: React.FC<{ onClick: () => void; knappetekst?: string; ikontekst?: string }> = ({
    onClick,
    knappetekst,
    ikontekst,
}) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<AddCircle title={knappetekst ? knappetekst : ikontekst} />}
            style={{ alignItems: 'start' }}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default LeggTilKnapp;
