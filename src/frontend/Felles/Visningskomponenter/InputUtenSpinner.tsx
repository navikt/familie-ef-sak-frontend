import React from 'react';
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
    return (
        <StyledInputUtenSpinner
            {...props}
            type="text"
            value={props.formatValue ? props.formatValue(props.value) : props.value}
            onWheel={(event) => event.currentTarget.blur()}
        />
    );
};

export default InputUtenSpinner;
