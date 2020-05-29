import React from 'react';
import { Adressebeskyttelse } from '../../typer/saksøk';
import { EtikettAdvarsel } from 'nav-frontend-etiketter';

interface IProps {
    adressebeskyttelse: Adressebeskyttelse;
}

const AdressebeskyttelseVarsel: React.FC<IProps> = ({ adressebeskyttelse }) => {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND:
            return <EtikettAdvarsel mini>Kode 6 U</EtikettAdvarsel>;
        case Adressebeskyttelse.STRENGT_FORTROLIG:
            return <EtikettAdvarsel mini>Kode 6</EtikettAdvarsel>;
        case Adressebeskyttelse.FORTROLIG:
            return <EtikettAdvarsel mini>Kode 7</EtikettAdvarsel>;
        default:
            return null;
    }
};

export default AdressebeskyttelseVarsel;
