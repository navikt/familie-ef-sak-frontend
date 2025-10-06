import { PlusCircleIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Button, ButtonProps } from '@navikt/ds-react';

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
        <Button
            className={className}
            icon={<PlusCircleIcon title={knappetekst ? knappetekst : ikontekst} />}
            iconPosition={ikonPosisjon}
            onClick={onClick}
            type="button"
            variant={variant || 'secondary'}
            size={size || 'medium'}
            disabled={disabled}
            style={{ width: 'fit-content' }}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default LeggTilKnapp;
