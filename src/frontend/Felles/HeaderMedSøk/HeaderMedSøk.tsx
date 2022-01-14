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
import Endringslogg from '@navikt/familie-endringslogg';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';
import { harTilgangTilRolle } from '../../App/utils/roller';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler: ISaksbehandler;
}

const lagAInntekt = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId?: string
): PopoverItem => {
    if (!fagsakId) {
        return { name: 'A-inntekt', href: appEnv.aInntekt, isExternal: true };
    }

    return {
        name: 'A-inntekt',
        href: '#/a-inntekt',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(await lagAInntektLink(axiosRequest, appEnv, fagsakId));
        },
    };
};

const lagEksterneLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    innloggetSaksbehandler: ISaksbehandler,
    fagsakId?: string
): PopoverItem[] => {
    const eksterneLenker = [lagAInntekt(axiosRequest, appEnv, fagsakId)];
    if (harTilgangTilRolle(appEnv, innloggetSaksbehandler, 'saksbehandler')) {
        eksterneLenker.push({
            name: 'Uttrekk arbeidssøkere (P43)',
            href: '/uttrekk/arbeidssoker',
        });
    }
    return eksterneLenker;
};

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { axiosRequest, gåTilUrl, appEnv, valgtFagsakId } = useApp();
    const { toggles } = useToggles();

    const eksterneLenker = useMemo(
        () => lagEksterneLenker(axiosRequest, appEnv, innloggetSaksbehandler, valgtFagsakId),
        [axiosRequest, appEnv, innloggetSaksbehandler, valgtFagsakId]
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
            {toggles[ToggleName.endringslogg] && innloggetSaksbehandler && (
                <Endringslogg
                    userId={innloggetSaksbehandler.navIdent}
                    dataFetchingIntervalSeconds={60 * 15}
                    appId={'EF'}
                    backendUrl={'/endringslogg'}
                    dataset={'production'}
                    maxEntries={50}
                    appName={'Enslig forsørger'}
                    alignLeft={true}
                    stil={'lys'}
                />
            )}
        </Header>
    );
};
