import React from 'react';
import InputUtenSpinner, { PropsInputUtenSpinner } from './InputUtenSpinner';

const InputMedTusenSkille: React.FC<PropsInputUtenSpinner & { className?: string }> = (props) => {
    const formaterVerdi = (verdi: number | string | undefined) => {
        if (verdi) {
            const formatertVerdi = Number(
                typeof verdi === 'string' ? verdi.replace(/,/g, '.') : verdi
            );

            return isNaN(formatertVerdi)
                ? verdi
                : formatertVerdi.toLocaleString('no-NO', {
                      currency: 'NOK',
                  });
        }
        return verdi;
    };

    return <InputUtenSpinner {...props} formatValue={formaterVerdi} />;
};

export default InputMedTusenSkille;
