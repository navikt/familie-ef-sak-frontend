import React, { FC } from 'react';
import { BodyShort } from '@navikt/ds-react';

interface BooleanTekstProps {
    value: boolean;
}

export const BooleanTekst: FC<BooleanTekstProps> = (props: { value: boolean }) => (
    <BodyShort size={'small'}>{props.value ? 'Ja' : 'Nei'}</BodyShort>
);
