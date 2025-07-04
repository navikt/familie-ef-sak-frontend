import React from 'react';
import { INavKontor } from '../../App/typer/personopplysninger';
import { Detail, HStack } from '@navikt/ds-react';
import { Buildings3Icon } from '@navikt/aksel-icons';

const NavKontor: React.FC<{ navKontor?: INavKontor }> = ({ navKontor }) => {
    return (
        <HStack className="nav-kontor-container" gap="space-4" justify="end">
            <HStack align="center">
                <Buildings3Icon width={24} height={24} />
                <Detail>
                    {navKontor ? `${navKontor.enhetNr} - ${navKontor.navn}` : 'Ingen data'}
                </Detail>
            </HStack>
        </HStack>
    );
};

export default NavKontor;
