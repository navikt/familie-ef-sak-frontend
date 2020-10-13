import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

export const BooleanTekst = (props: { value: boolean }): JSX.Element => (
    <Normaltekst>{props.value ? 'Ja' : 'Nei'}</Normaltekst>
);
