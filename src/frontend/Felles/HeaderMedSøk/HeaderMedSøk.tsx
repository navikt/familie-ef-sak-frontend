import React, { useEffect, useState } from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';
import { AppEnv } from '../../App/api/env';
import { lagAInntektLink } from '../Linker/AInntekt/AInntektLink';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const lagAInntekt = (appEnv: AppEnv, personIdent?: string): PopoverItem => {
    if (!personIdent) {
        return { name: 'A-inntekt', href: appEnv.aInntekt, isExternal: true };
    }

    return {
        name: 'A-inntekt',
        href: '#/a-inntekt',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(await lagAInntektLink(appEnv, personIdent));
        },
    };
};

const lagEksterneLenker = (appEnv: AppEnv, personIdent?: string): PopoverItem[] => {
    return [lagAInntekt(appEnv, personIdent)];
};

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { gåTilUrl, appEnv, valgtPersonIdent } = useApp();
    const [eksterneLenker, settEksterneLenker] = useState<PopoverItem[]>([]);

    useEffect(() => {
        settEksterneLenker(lagEksterneLenker(appEnv, valgtPersonIdent));
    }, [settEksterneLenker, appEnv, valgtPersonIdent]);

    return (
        <Header
            tittelOnClick={() => {
                gåTilUrl('/');
            }}
            tittelHref={'#'}
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
