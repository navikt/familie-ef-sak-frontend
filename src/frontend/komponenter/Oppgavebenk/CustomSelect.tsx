import React, { ReactElement } from 'react';
import { Select } from 'nav-frontend-skjema';

interface Props<U extends string> {
    value?: string | number;
    label: string;
    onChange: (value: string) => void;
    options: Record<U, string>;
}

function CustomSelect<U extends string>(props: Props<U>): ReactElement {
    return (
        <Select
            value={props.value || ''}
            className="flex-item"
            label={props.label}
            onChange={(event) => {
                event.persist();
                props.onChange(event.target.value);
            }}
        >
            <option value="">Alle</option>
            {Object.entries<string>(props.options).map<ReactElement>(([val, tekst]) => (
                <option key={val} value={val}>
                    {tekst}
                </option>
            ))}
        </Select>
    );
}

export default CustomSelect;
