import { Cancel } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const TilbakestillKnapp: React.FC<{
    onClick: () => void;
    knappetekst?: string;
    ikontekst?: string;
}> = ({ onClick, knappetekst, ikontekst }) => {
    return (
        <Button
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            icon={<Cancel title={knappetekst ? knappetekst : ikontekst} />}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default TilbakestillKnapp;
