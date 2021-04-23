import React, { useEffect, useRef, useState } from 'react';
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
    // Må bytte til input[type=text] for å støtte visuell tusenseparator
    const [harFokus, settHarFokus] = useState(false);

    // Unngå at scrolling endrer verdi i inputfeltet
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleWheel = (e: WheelEvent) => e.preventDefault();
    useEffect(() => {
        if (inputRef) {
            inputRef?.current?.addEventListener('wheel', handleWheel);

            return () => {
                inputRef?.current?.removeEventListener('wheel', handleWheel);
            };
        }
    }, [inputRef]);

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
                inputRef={(ref) => {
                    inputRef.current = ref;
                }}
            />
        );
    }
    return <NummerInputUtenSpinner {...props} onBlur={() => settHarFokus(false)} />;
};

export default InputMedTusenSkille;
