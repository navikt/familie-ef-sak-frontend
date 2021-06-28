import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

//"Inspirert" av https://github.com/navikt/modiapersonoversikt-skrivestotte/

export interface FieldState {
    value: string;
    onChange: React.ChangeEventHandler;
    setValue: Dispatch<SetStateAction<string>>;
}

export default function useFieldState(initialState: string): FieldState {
    const [value, setValue] = useState(initialState);
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
        [setValue]
    );

    return {
        value,
        onChange,
        setValue,
    };
}
