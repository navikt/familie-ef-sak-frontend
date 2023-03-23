import React, { FC } from 'react';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';
import { UNSAFE_useDatepicker, UNSAFE_DatePicker } from '@navikt/ds-react';
import { nullableTilDato } from '../../../App/utils/dato';

export const FristVelger: FC<{
    oppgave: IOppgave;
    settFrist: (frist: string | undefined) => void;
}> = ({ oppgave, settFrist }) => {
    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        defaultSelected: nullableTilDato(oppgave.fristFerdigstillelse),
        onDateChange: (dato) => settFrist(dato?.toISOString()),
    });

    return (
        <div>
            <UNSAFE_DatePicker {...datepickerProps}>
                <UNSAFE_DatePicker.Input label={'Frist'} {...inputProps} size={'small'} />
            </UNSAFE_DatePicker>
        </div>
    );
};
