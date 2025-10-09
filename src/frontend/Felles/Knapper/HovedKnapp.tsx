import React from 'react';
import { Button } from '@navikt/ds-react';

export const HovedKnapp: React.FC<{
    className?: string;
    disabled?: boolean;
    knappetekst?: string;
    onClick?: () => void;
}> = ({ className, disabled, knappetekst, onClick }) => {
    return (
        <Button
            className={className}
            disabled={disabled}
            onClick={onClick}
            type="submit"
            variant="primary"
            style={{ width: 'fit-content' }}
        >
            {knappetekst && <span>{knappetekst}</span>}
        </Button>
    );
};

export default HovedKnapp;
