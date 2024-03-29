import React, { ReactElement } from 'react';
import { Select, SelectProps } from '@navikt/ds-react';

interface Props<U extends string> {
    value?: string | number;
    hideLabel?: SelectProps['hideLabel'];
    label: string;
    onChange: (value: string) => void;
    options: Record<U, string>;
    sortDesc?: boolean;
    skalSkjuleValgetAlle?: boolean;
    size?: SelectProps['size'];
}

function CustomSelect<U extends string>(props: Props<U>): ReactElement {
    const sorterAsc = (a: [string, string], b: [string, string]) => {
        if (a[1] > b[1]) return 1;
        else if (a[1] < b[1]) return -1;
        return 0;
    };

    const sorterDesc = (a: [string, string], b: [string, string]) => {
        if (a[1] > b[1]) return -1;
        else if (a[1] < b[1]) return 1;
        return 0;
    };

    const sorterteProps = Object.entries<string>(props.options).sort(
        props.sortDesc ? sorterDesc : sorterAsc
    );

    return (
        <Select
            size={props.size || 'medium'}
            value={props.value || ''}
            className="flex-item"
            label={props.label}
            hideLabel={props.hideLabel}
            onChange={(event) => {
                event.persist();
                props.onChange(event.target.value);
            }}
        >
            {!props.skalSkjuleValgetAlle && <option value="">Alle</option>}
            {sorterteProps.map<ReactElement>(([val, tekst]) => (
                <option key={val} value={val}>
                    {tekst}
                </option>
            ))}
        </Select>
    );
}

export default CustomSelect;
