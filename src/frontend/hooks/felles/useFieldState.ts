import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

//"Inspirert" av https://github.com/navikt/modiapersonoversikt-skrivestotte/

export interface FieldState {
    value: string;
    errorMessage?: string | undefined;
    onChange: React.ChangeEventHandler;
    isValid: boolean;
    setValue: Dispatch<SetStateAction<string>>;
}

export default function useFieldState(
    initialState: string,
    validate?: (value: string) => string | undefined
): FieldState {
    const [value, setValue] = useState(initialState);
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
        [setValue]
    );

    return {
        value,
        onChange,
        setValue,
        isValid: validate ? validate(value) === undefined : true,
        errorMessage: validate && validate(value),
    };
}
