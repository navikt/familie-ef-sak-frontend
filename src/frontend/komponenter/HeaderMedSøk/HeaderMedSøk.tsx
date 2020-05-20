import React from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../typer/saksbehandler';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    return (
        <Header
            tittel="Alene med barn"
            brukerinfo={{
                navn: (innloggetSaksbehandler && innloggetSaksbehandler.displayName) || 'Ukjent',
                enhet: (innloggetSaksbehandler && innloggetSaksbehandler.enhet) || 'Ukjent',
            }}
            brukerPopoverItems={[{ name: 'Logg ut', href: `${window.origin}/auth/logout` }]}
        >
            {innloggetSaksbehandler && (
                <PersonSøk innloggetSaksbehandler={innloggetSaksbehandler} />
            )}
        </Header>
    );
};
