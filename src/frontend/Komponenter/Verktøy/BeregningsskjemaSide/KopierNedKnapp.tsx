import { ArrowRedoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

export const KopierNedKnapp: React.FC<{
    beregningIndeks: number;
    kopierRedusertEtterTilBeregningerUnder: (beregningIndeks: number) => void;
}> = ({ beregningIndeks, kopierRedusertEtterTilBeregningerUnder }) => {
    return (
        <Button
            onClick={() => kopierRedusertEtterTilBeregningerUnder(beregningIndeks)}
            style={{
                transform: 'rotate(90deg)',
            }}
            size="small"
            icon={<ArrowRedoIcon title="kopier ned" fontSize="1.5rem" />}
            variant="tertiary-neutral"
        />
    );
};
