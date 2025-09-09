import { MinusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

export const SlettKolonneKnapp: React.FC<{
    arbeidsgiverIndeks: number;
    slettKolonne: (arbeidsgiverIndeks: number) => void;
}> = ({ arbeidsgiverIndeks, slettKolonne }) => {
    return (
        <Button
            size="small"
            icon={<MinusCircleIcon title="a11y-title" />}
            onClick={() => slettKolonne(arbeidsgiverIndeks)}
        />
    );
};
