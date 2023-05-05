import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import { Knapp } from './HovedKnapp';

const LeggTilKnapp: React.FC<{
    className?: string;
    ikontekst?: string;
    knappetekst?: string;
    onClick: () => void;
    variant?: string;
}> = ({ className, ikontekst, knappetekst, onClick, variant }) => {
    return (
        <Knapp
            className={className}
            icon={<AddCircle title={knappetekst ? knappetekst : ikontekst} />}
            onClick={onClick}
            type="button"
            variant={variant ? variant : 'secondary'}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default LeggTilKnapp;
