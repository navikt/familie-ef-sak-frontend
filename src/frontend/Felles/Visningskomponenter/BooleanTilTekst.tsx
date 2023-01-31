import React, { FC } from 'react';
import { BodyShortSmall } from './Tekster';
import { mapTrueFalse } from '../../App/utils/formatter';

interface BooleanTekstProps {
    value: boolean;
}

export const BooleanTekst: FC<BooleanTekstProps> = (props: { value: boolean }) => (
    <BodyShortSmall>{mapTrueFalse(props.value)}</BodyShortSmall>
);
