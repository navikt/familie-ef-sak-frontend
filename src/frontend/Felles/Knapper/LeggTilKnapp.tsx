import { PlusCircleIcon } from '@navikt/aksel-icons';
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
    size?: ButtonProps['size'];
    disabled?: boolean;
}> = ({ className, ikontekst, ikonPosisjon, knappetekst, onClick, variant, size, disabled }) => {
    return (
        <Knapp
            className={className}
            icon={<PlusCircleIcon title={knappetekst ? knappetekst : ikontekst} />}
            iconPosition={ikonPosisjon}
            onClick={onClick}
            type="button"
            variant={variant || 'secondary'}
            size={size || 'medium'}
            disabled={disabled}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Knapp>
    );
};

export default LeggTilKnapp;
