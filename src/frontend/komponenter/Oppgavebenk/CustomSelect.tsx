import React from 'react';
import { Select } from 'nav-frontend-skjema';
import { Dictionary } from '../../typer/utils';

interface Props {
    value?: string | number;
    label: string;
    onChange: (value: string) => void;
    options: Dictionary<string>;
}

const CustomSelect: React.FC<Props> = ({ value, label, onChange, options }) => {
    return (
        <Select
            value={value || ''}
            className="flex-item"
            label={label}
            onChange={(event) => {
                event.persist();
                onChange(event.target.value);
            }}
        >
            <option value="">Alle</option>
            {Object.entries(options).map(([val, tekst]) => (
                <option key={val} value={val}>
                    {tekst}
                </option>
            ))}
        </Select>
    );
};

export default CustomSelect;
