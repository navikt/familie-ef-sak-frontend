import React, { useMemo } from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';
import { AppEnv } from '../../App/api/env';
import { lagAInntektLink } from '../Linker/AInntekt/AInntektLink';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler?: ISaksbehandler;
}

const lagAInntekt = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    valgtFagsakId?: string
): PopoverItem => {
    if (!valgtFagsakId) {
        return { name: 'A-inntekt', href: appEnv.aInntekt, isExternal: true };
    }

    return {
        name: 'A-inntekt',
        href: '#/a-inntekt',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(await lagAInntektLink(axiosRequest, appEnv, valgtFagsakId));
        },
    };
};

const lagEksterneLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    valgtFagsakId?: string
): PopoverItem[] => {
    return [lagAInntekt(axiosRequest, appEnv, valgtFagsakId)];
};

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { axiosRequest, gåTilUrl, appEnv, valgtFagsakId } = useApp();

    const eksterneLenker = useMemo(
        () => lagEksterneLenker(axiosRequest, appEnv, valgtFagsakId),
        [axiosRequest, appEnv, valgtFagsakId]
    );

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
