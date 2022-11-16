import React from 'react';
import { RadioGroup, RadioGroupProps } from '@navikt/ds-react';
import { FamilieLesefelt } from '@navikt/familie-form-elements';

export interface IRadioGruppeProps extends RadioGroupProps {
    erLesevisning: boolean;
}
export const EnsligRadioGruppe: React.FC<IRadioGruppeProps> = ({
    children,
    className,
    erLesevisning,
    legend,
    value,
    ...props
}) => {
    return erLesevisning ? (
        <FamilieLesefelt className={className} label={legend} verdi={value} {...props} />
    ) : (
        <RadioGroup className={className} value={value} legend={legend} {...props}>
            {children}
        </RadioGroup>
    );
};
