import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FamilieInput, IFamilieInputProps } from '@navikt/familie-form-elements';

export interface PropsInputUtenSpinner extends IFamilieInputProps {
    value: number | string | undefined;
    formatValue?: (value: number | string | undefined) => number | string | undefined;
}

const StyledInputUtenSpinner = styled(FamilieInput)`
    text-align: right;
    input {
        text-align: right;
    }
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

const InputUtenSpinner: React.FC<PropsInputUtenSpinner> = (props) => {
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

    if (!harFokus) {
        return (
            <StyledInputUtenSpinner
                {...props}
                type="text"
                value={props.formatValue ? props.formatValue(props.value) : props.value}
                onFocus={() => settHarFokus(true)}
                inputRef={(ref) => {
                    inputRef.current = ref;
                }}
            />
        );
    }
    return <StyledInputUtenSpinner {...props} onBlur={() => settHarFokus(false)} />;
};

export default InputUtenSpinner;
