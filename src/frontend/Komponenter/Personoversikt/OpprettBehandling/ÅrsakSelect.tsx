import React, { Dispatch, SetStateAction } from 'react';
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { Select } from '@navikt/ds-react';
import { Klagebehandlingsårsak } from '../../../App/typer/klagebehandlingsårsak';

type Årsak = Behandlingsårsak | Klagebehandlingsårsak;

interface Props<T extends Årsak> {
    valgmuligheter: T[];
    valgtBehandlingsårsak: T | undefined;
    settValgtBehandlingsårsak: Dispatch<SetStateAction<T | undefined>>;
    årsakTilTekst: Record<T, string>;
}

export const ÅrsakSelect = <T extends Årsak>({
    valgmuligheter,
    valgtBehandlingsårsak,
    settValgtBehandlingsårsak,
    årsakTilTekst,
}: Props<T>) => (
    <Select
        label="Årsak"
        value={valgtBehandlingsårsak || ''}
        onChange={(e) => {
            settValgtBehandlingsårsak(e.target.value as T);
        }}
    >
        <option value="">Velg</option>
        {valgmuligheter.map((behandlingsårsak, index: number) => (
            <option key={index} value={behandlingsårsak}>
                {årsakTilTekst[behandlingsårsak]}
            </option>
        ))}
    </Select>
);
