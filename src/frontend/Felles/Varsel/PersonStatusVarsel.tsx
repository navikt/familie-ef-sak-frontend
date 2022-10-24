import React from 'react';
import { Folkeregisterpersonstatus } from '../../App/typer/personopplysninger';
import { Tag } from '@navikt/ds-react';

interface IProps {
    folkeregisterpersonstatus: Folkeregisterpersonstatus;
}

const PersonStatusVarsel: React.FC<IProps> = ({ folkeregisterpersonstatus }) => {
    switch (folkeregisterpersonstatus) {
        case Folkeregisterpersonstatus.DØD:
            return (
                <Tag variant={'error'} size={'small'}>
                    Død
                </Tag>
            );
        case Folkeregisterpersonstatus.FORSVUNNET:
            return (
                <Tag variant={'error'} size={'small'}>
                    Forsvunnet
                </Tag>
            );
        case Folkeregisterpersonstatus.UTFLYTTET:
            return (
                <Tag variant={'error'} size={'small'}>
                    Utflyttet
                </Tag>
            );
        default:
            return null;
    }
};

export default PersonStatusVarsel;
