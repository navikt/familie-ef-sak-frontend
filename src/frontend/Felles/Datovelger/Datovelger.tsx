import React, { FC } from 'react';
import { useDatepicker, DatePicker } from '@navikt/ds-react';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { nullableTilDato, tilLocaleDateString } from '../../App/utils/dato';
import { formaterNullableIsoDato } from '../../App/utils/formatter';

export const Datovelger: FC<{
    verdi: string | undefined;
    settVerdi: (verdi: string | undefined) => void;
    erLesevisning?: boolean;
    label: string;
    id: string;
    feil?: string;
    maksDato?: Date;
    minDato?: Date;
}> = ({ settVerdi, erLesevisning, verdi, label, id, feil, minDato, maksDato }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(verdi),
        onDateChange: (dato) => settVerdi(dato && tilLocaleDateString(dato)),
        toDate: maksDato,
        fromDate: minDato,
    });

    return (
        <div>
            {erLesevisning ? (
                <FamilieLesefelt
                    size={'small'}
                    label={label}
                    verdi={formaterNullableIsoDato(verdi)}
                />
            ) : (
                <DatePicker id={id} {...datepickerProps} dropdownCaption>
                    <DatePicker.Input label={label} {...inputProps} error={feil} size={'medium'} />
                </DatePicker>
            )}
        </div>
    );
};
