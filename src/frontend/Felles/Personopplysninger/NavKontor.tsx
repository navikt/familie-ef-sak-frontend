import React from 'react';
import { INavKontor } from '../../App/typer/personopplysninger';
import { Detail } from '@navikt/ds-react';
import { Buildings3Icon } from '@navikt/aksel-icons';
import PersonopplysningerPanel from './PersonopplysningPanel';

const OfficeIkon: React.FC = () => <Buildings3Icon width={24} height={24} />;

const NavKontor: React.FC<{ navKontor?: INavKontor }> = ({ navKontor }) => {
    return (
        <PersonopplysningerPanel Ikon={OfficeIkon} tittel="NAV-kontor">
            <Detail>{navKontor ? `${navKontor.enhetNr} - ${navKontor.navn}` : 'Ingen data'}</Detail>
        </PersonopplysningerPanel>
    );
};

export default NavKontor;
