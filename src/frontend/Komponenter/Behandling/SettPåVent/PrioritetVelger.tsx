import React, { FC } from 'react';
import { Select } from '@navikt/ds-react';
import { Prioritet, prioritetTilTekst } from '../../Oppgavebenk/typer/oppgavetema';

export const PrioritetVelger: FC<{
    prioritet: Prioritet | undefined;
    settPrioritet: (prioritet: Prioritet) => void;
}> = ({ prioritet, settPrioritet }) => (
    <div>
        <Select
            label={'Prioritet'}
            size={'small'}
            value={prioritet}
            onChange={(e) => {
                settPrioritet(e.target.value as Prioritet);
            }}
        >
            {Object.entries(prioritetTilTekst).map(([prioritet, tekst]) => {
                return (
                    <option key={prioritet} value={prioritet}>
                        {tekst}
                    </option>
                );
            })}
        </Select>
    </div>
);
