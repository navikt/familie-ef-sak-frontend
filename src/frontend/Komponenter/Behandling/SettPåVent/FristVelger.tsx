import React, { FC } from 'react';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';
import { UNSAFE_useDatepicker, UNSAFE_DatePicker } from '@navikt/ds-react';
import { nullableTilDato, tilLocaleDateString } from '../../../App/utils/dato';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';

export const FristVelger: FC<{
    oppgave: IOppgave;
    settFrist: (frist: string | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgave, settFrist, erLesevisning }) => {
    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
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
                <UNSAFE_DatePicker {...datepickerProps}>
                    <UNSAFE_DatePicker.Input label={'Frist'} {...inputProps} size={'small'} />
                </UNSAFE_DatePicker>
            )}
        </div>
    );
};
