import * as React from 'react';
import { Textarea } from 'nav-frontend-skjema';
import { ChangeEvent, FC } from 'react';

interface Props {
    label?: string;
    maxLength?: number;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement> | { [p: string]: never }) => void;
}

const Begrunnelse: FC<Props> = ({ label, maxLength, onChange, placeholder, value }) => {
    return (
        <Textarea
            label={label ? label : 'Begrunnelse'}
            maxLength={maxLength ? maxLength : 0}
            placeholder={placeholder ? placeholder : 'Skriv inn tekst'}
            value={value}
            onChange={onChange}
        />
    );
};
export default Begrunnelse;
