import React, { FC } from 'react';
import { Prioritet, prioritetTilTekst } from '../../Oppgavebenk/typer/oppgavetema';
import { FamilieSelect } from '../../../Felles/Input/FamilieSelect';

export const PrioritetVelger: FC<{
    prioritet: Prioritet | undefined;
    settPrioritet: (prioritet: Prioritet) => void;
    erLesevisning: boolean;
}> = ({ prioritet, settPrioritet, erLesevisning }) => (
    <div>
        <FamilieSelect
            label={'Prioritet'}
            size={'small'}
            value={prioritet}
            erLesevisning={erLesevisning}
            lesevisningVerdi={prioritet ? prioritetTilTekst[prioritet] : 'Ikke satt'}
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
        </FamilieSelect>
    </div>
);
