import { Normaltekst } from 'nav-frontend-typografi';
import React, { FC } from 'react';

interface BooleanTekstProps {
    value: boolean;
}

export const BooleanTekst: FC<BooleanTekstProps> = (props: { value: boolean }) => (
    <Normaltekst>{props.value ? 'Ja' : 'Nei'}</Normaltekst>
);
