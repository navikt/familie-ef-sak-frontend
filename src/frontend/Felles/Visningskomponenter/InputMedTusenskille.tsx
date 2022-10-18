import React from 'react';
import InputUtenSpinner, { PropsInputUtenSpinner } from './InputUtenSpinner';

const InputMedTusenSkille: React.FC<PropsInputUtenSpinner & { className?: string }> = (props) => {
    const formaterVerdi = (verdi: number | string | undefined) => {
        if (verdi) {
            return Number(verdi).toLocaleString('no-NO', { currency: 'NOK' });
        }
        return verdi;
    };

    return <InputUtenSpinner {...props} formatValue={formaterVerdi} />;
};

export default InputMedTusenSkille;
