import React from 'react';
import InputUtenSpinner, { PropsInputUtenSpinner } from './InputUtenSpinner';

const InputMedTusenSkille: React.FC<PropsInputUtenSpinner> = (props) => {
    const formaterVerdi = (verdi: number | string | undefined) => {
        if (verdi) {
            return Number(verdi).toLocaleString('no-NO') + ' kr';
        }
        return verdi + ' kr';
    };

    return <InputUtenSpinner {...props} formatValue={formaterVerdi} />;
};

export default InputMedTusenSkille;
