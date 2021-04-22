import React, { useState } from 'react';
import { Input, InputProps } from 'nav-frontend-skjema';
import styled from 'styled-components';

interface TusenseparatorProps extends InputProps {
    value: number | string | undefined;
}

const NummerInputUtenSpinner = styled(Input)`
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        -moz-appearance: textfield;
    }
`;

const InputMedTusenSkille: React.FC<TusenseparatorProps> = (props) => {
    const [harFokus, settHarFokus] = useState(false);

    const formaterVerdi = (verdi: number | string | undefined) => {
        if (verdi) {
            return Number(verdi).toLocaleString('no-NO', { currency: 'NOK' });
        }
        return verdi;
    };
    if (!harFokus) {
        return (
            <NummerInputUtenSpinner
                {...props}
                type="text"
                value={formaterVerdi(props.value)}
                onFocus={() => settHarFokus(true)}
            />
        );
    }
    return <NummerInputUtenSpinner {...props} onBlur={() => settHarFokus(false)} />;
};

export default InputMedTusenSkille;
