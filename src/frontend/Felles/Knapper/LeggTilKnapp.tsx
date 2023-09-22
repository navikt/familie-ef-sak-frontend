import { AddCircle } from '@navikt/ds-icons';
import React from 'react';
import { Knapp } from './HovedKnapp';
import { ButtonProps } from '@navikt/ds-react';

const LeggTilKnapp: React.FC<{
    className?: string;
    ikontekst?: string;
    ikonPosisjon?: ButtonProps['iconPosition'];
    knappetekst?: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
}> = ({ className, ikontekst, ikonPosisjon, knappetekst, onClick, variant }) => {
    return (
        <Knapp
            className={className}
            icon={<AddCircle title={knappetekst ? knappetekst : ikontekst} />}
            iconPosition={ikonPosisjon}
            onClick={onClick}
            type="button"
            variant={variant || 'secondary'}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default LeggTilKnapp;
