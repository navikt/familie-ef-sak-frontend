import React from 'react';
import { Th } from '../../../Felles/Personopplysninger/TabellWrapper';
import { SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';

export const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => {
    return (
        <Th width={`${width}%`}>
            <SmallTextLabel>{text}</SmallTextLabel>
        </Th>
    );
};
