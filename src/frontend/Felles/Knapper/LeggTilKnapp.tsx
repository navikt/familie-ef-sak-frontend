import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import { Knapp } from './HovedKnapp';

const LeggTilKnapp: React.FC<{
    className?: string;
    iconPosition?: 'left' | 'right';
    ikontekst?: string;
    knappetekst?: string;
    onClick: () => void;
    variant?: string;
}> = ({ className, iconPosition, ikontekst, knappetekst, onClick, variant }) => {
    return (
        <Knapp
            className={className}
            icon={<AddCircle title={knappetekst ? knappetekst : ikontekst} />}
            iconPosition={iconPosition ? iconPosition : 'left'}
            onClick={onClick}
            type="button"
            variant={variant ? variant : 'secondary'}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default LeggTilKnapp;
