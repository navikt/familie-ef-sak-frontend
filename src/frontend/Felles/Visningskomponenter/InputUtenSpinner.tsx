import React, { useState } from 'react';
import styled from 'styled-components';
import { ASpacing12 } from '@navikt/ds-tokens/dist/tokens';
import { BodyShort, TextField, TextFieldProps } from '@navikt/ds-react';

export interface PropsInputUtenSpinner extends TextFieldProps {
    value: number | string | undefined;
    formatValue?: (value: number | string | undefined) => number | string | undefined;
}

const StyledInputUtenSpinner = styled(TextField)`
    text-align: right;
    input {
        text-align: right;
        height: ${ASpacing12};
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

    /* Fjerner rød prikk før feilmelding */
    .navds-error-message::before {
        content: none;
    }
`;

const InputUtenSpinner: React.FC<PropsInputUtenSpinner> = ({ formatValue, ...props }) => {
    const [harFokus, settHarFokus] = useState(false);

    const formatertVerdi = formatValue ? formatValue(props.value) : props.value;

    if (props.readOnly) {
        return <BodyShort>{formatertVerdi}</BodyShort>;
    }

    if (harFokus) {
        return (
            <StyledInputUtenSpinner
                {...props}
                type="text"
                autoComplete="off"
                value={props.value}
                onWheel={(event) => event.currentTarget.blur()}
                onBlur={() => settHarFokus(false)}
                label={''}
                hideLabel
            />
        );
    }

    return (
        <StyledInputUtenSpinner
            {...props}
            type="text"
            autoComplete="off"
            value={formatertVerdi}
            onWheel={(event) => event.currentTarget.blur()}
            label={''}
            onFocus={() => settHarFokus(true)}
            hideLabel
        />
    );
};

export default InputUtenSpinner;
