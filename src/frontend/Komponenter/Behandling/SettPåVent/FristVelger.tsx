import React, { FC } from 'react';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';
import { useDatepicker, DatePicker } from '@navikt/ds-react';
import { nullableTilDato, tilLocaleDateString } from '../../../App/utils/dato';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';

export const FristVelger: FC<{
    oppgave: IOppgave;
    settFrist: (frist: string | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgave, settFrist, erLesevisning }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(oppgave.fristFerdigstillelse),
        onDateChange: (dato) => settFrist(dato && tilLocaleDateString(dato)),
    });

    return (
        <div>
            {erLesevisning ? (
                <FamilieLesefelt
                    size={'small'}
                    label={'Frist'}
                    verdi={formaterNullableIsoDato(oppgave.fristFerdigstillelse)}
                />
            ) : (
                <DatePicker {...datepickerProps}>
                    <DatePicker.Input label={'Frist'} {...inputProps} size={'small'} />
                </DatePicker>
            )}
        </div>
    );
};
