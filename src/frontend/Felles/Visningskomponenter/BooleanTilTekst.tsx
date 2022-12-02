import React, { FC } from 'react';
import { BodyShortSmall } from './Tekster';

interface BooleanTekstProps {
    value: boolean;
}

export const BooleanTekst: FC<BooleanTekstProps> = (props: { value: boolean }) => (
    <BodyShortSmall>{props.value ? 'Ja' : 'Nei'}</BodyShortSmall>
);
