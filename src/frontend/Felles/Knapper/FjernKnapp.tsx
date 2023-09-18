import { TrashIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Knapp } from './HovedKnapp';

const FjernKnapp: React.FC<{
    className?: string;
    ikontekst?: string;
    knappetekst?: string;
    onClick: () => void;
}> = ({ className, ikontekst, knappetekst, onClick }) => {
    return (
        <Knapp
            className={className}
            icon={<TrashIcon title={knappetekst ? knappetekst : ikontekst} />}
            onClick={onClick}
            type="button"
            variant={knappetekst ? 'secondary' : 'tertiary'}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default FjernKnapp;
