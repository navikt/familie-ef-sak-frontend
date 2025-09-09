import React from 'react';
import { Beregninger } from './typer';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

export const SettBeregnetFraKnapp: React.FC<{
    beregningIndeks: number;
    oppdaterBeregnetfra: (beregninger: Beregninger, indeks: number) => Beregninger;
    settBeregninger: (value: React.SetStateAction<Beregninger>) => void;
}> = ({ beregningIndeks, oppdaterBeregnetfra, settBeregninger }) => {
    return (
        <Button
            variant="tertiary"
            size="xsmall"
            icon={<ArrowRightIcon title="Sett beregnet fra" fontSize="1.5rem" />}
            onClick={() => settBeregninger((prev) => oppdaterBeregnetfra(prev, beregningIndeks))}
        />
    );
};
