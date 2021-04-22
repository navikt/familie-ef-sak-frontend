import React, { useState } from 'react';
import { Input, InputProps } from 'nav-frontend-skjema';

interface TusenseparatorProps extends InputProps {
    value: number | string | undefined;
}

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
            <Input
                {...props}
                type="text"
                value={formaterVerdi(props.value)}
                onFocus={() => settHarFokus(true)}
            />
        );
    }
    return <Input {...props} onBlur={() => settHarFokus(false)} />;
};

export default InputMedTusenSkille;
