import { Delete } from '@navikt/ds-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const FjernKnapp: React.FC<{
    className?: string;
    ikontekst?: string;
    knappetekst?: string;
    onClick: () => void;
}> = ({ className, ikontekst, knappetekst, onClick }) => {
    return (
        <Button
            className={className}
            icon={<Delete title={knappetekst ? knappetekst : ikontekst} />}
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default FjernKnapp;
