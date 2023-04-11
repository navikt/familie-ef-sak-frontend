import React, { ReactElement } from 'react';
import { IMappe } from './typer/mappe';
import { enhetTilTekstPåString } from './typer/enhet';
import { Select } from '@navikt/ds-react';
import { sorterMapperPåNavn } from './utils';

interface Props {
    value?: string | number;
    label: string;
    onChange: (value: string) => void;
    options: IMappe[];
    erUtenMappe?: boolean;
}

function MappeVelger(props: Props): ReactElement {
    const mapperPerEnhet = [...props.options].reduce((acc, mappe) => {
        return { ...acc, [mappe.enhetsnr]: [...(acc[mappe.enhetsnr] ?? []), mappe] };
    }, {} as Record<string, IMappe[]>);

    const sorterMappeListerPåEnhetsnummer = (a: [string, IMappe[]], b: [string, IMappe[]]) => {
        if (a[0] > b[0]) return -1;
        else if (a[0] < b[0]) return 1;
        return 0;
    };

    const utledValue = () => {
        if (props.erUtenMappe) return 'uplassert';
        else if (props.value) return props.value;
        return '';
    };

    return (
        <Select
            value={utledValue()}
            className="flex-item"
            label={props.label}
            onChange={(event) => {
                event.persist();
                props.onChange(event.target.value);
            }}
        >
            <option value="">Alle</option>
            <option value="uplassert">Uplassert</option>
            {[...Object.entries<IMappe[]>(mapperPerEnhet)]
                .sort(sorterMappeListerPåEnhetsnummer)
                .map<ReactElement>(([val, mapper], index) => {
                    return (
                        <optgroup label={enhetTilTekstPåString[val]} key={index}>
                            {[...mapper].sort(sorterMapperPåNavn).map((mappe) => {
                                return (
                                    <option value={mappe.id} key={mappe.id}>
                                        {mappe.navn}
                                    </option>
                                );
                            })}
                        </optgroup>
                    );
                })}
        </Select>
    );
}

export default MappeVelger;
