import React, { FC } from 'react';
import { useDatepicker, DatePicker, BodyShort, Label } from '@navikt/ds-react';
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
    placeholder?: string;
}> = ({ settVerdi, erLesevisning, verdi, label, id, feil, minDato, maksDato, placeholder }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(verdi),
        onDateChange: (dato) => settVerdi(dato && tilLocaleDateString(dato)),
        toDate: maksDato,
        fromDate: minDato,
    });

    const formatertDato = formaterNullableIsoDato(verdi);

    return (
        <div>
            {erLesevisning ? (
                <div>
                    <Label size={'small'}>{label}</Label>
                    <BodyShort size={'small'}>{formatertDato}</BodyShort>
                </div>
            ) : (
                <DatePicker id={id} {...datepickerProps}>
                    <DatePicker.Input
                        label={label}
                        placeholder={placeholder}
                        {...inputProps}
                        error={feil}
                        size={'medium'}
                    />
                </DatePicker>
            )}
        </div>
    );
};
