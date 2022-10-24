import React from 'react';
import { Adressebeskyttelse } from '../../App/typer/personopplysninger';
import { Tag } from '@navikt/ds-react';

interface IProps {
    adressebeskyttelse: Adressebeskyttelse;
}

const AdressebeskyttelseVarsel: React.FC<IProps> = ({ adressebeskyttelse }) => {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND:
            return (
                <Tag variant={'error'} size={'small'}>
                    Kode 6 U
                </Tag>
            );
        case Adressebeskyttelse.STRENGT_FORTROLIG:
            return (
                <Tag variant={'error'} size={'small'}>
                    Kode 6
                </Tag>
            );
        case Adressebeskyttelse.FORTROLIG:
            return (
                <Tag variant={'error'} size={'small'}>
                    Kode 7
                </Tag>
            );
        default:
            return null;
    }
};

export default AdressebeskyttelseVarsel;
