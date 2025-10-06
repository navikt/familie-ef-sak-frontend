import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

const FjernKnapp: React.FC<{
    className?: string;
    ikontekst?: string;
    knappetekst?: string;
    onClick: () => void;
}> = ({ className, ikontekst, knappetekst, onClick }) => {
    return (
        <Button
            className={className}
            icon={<TrashIcon title={knappetekst ? knappetekst : ikontekst} />}
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
            style={{ width: 'fit-content' }}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default FjernKnapp;
