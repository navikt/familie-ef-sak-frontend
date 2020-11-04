import React from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../typer/saksbehandler';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import './headermedsøk.less';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

// TODO: Må finne riktige lenker her
const eksterneLenker: PopoverItem[] = [
    { name: 'Rettskildene', href: '#/1' },
    { name: 'Rutinebeskrivelser', href: '#/2' },
    { name: 'A-inntekt', href: '#/3' },
    { name: 'Aareg', href: '#/4' },
    { name: 'Gosys', href: '#/5' },
    { name: 'Modia', href: '#/6' },
    { name: 'Pesys', href: '#/7' },
];

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    return (
        <Header
            tittel="NAV Enslig mor eller far"
            brukerinfo={{
                navn: innloggetSaksbehandler?.displayName || 'Ukjent',
            }}
            brukerPopoverItems={[{ name: 'Logg ut', href: `${window.origin}/auth/logout` }]}
            eksterneLenker={eksterneLenker}
        >
            {innloggetSaksbehandler && <PersonSøk />}
        </Header>
    );
};
