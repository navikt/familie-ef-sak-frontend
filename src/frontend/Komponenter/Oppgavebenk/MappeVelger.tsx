import React, { ReactElement } from 'react';
import { Select } from 'nav-frontend-skjema';
import { IMappe } from './typer/mappe';
import { enhetTilTekstPåString } from './typer/enhet';

interface Props {
    value?: string | number;
    label: string;
    onChange: (value: string) => void;
    options: IMappe[];
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

    const sorterMapperPåNavn = (a: IMappe, b: IMappe) => {
        if (a.navn > b.navn) return 1;
        else if (a.navn < b.navn) return -1;
        return 0;
    };

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
