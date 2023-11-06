import React, { useMemo } from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';
import { AppEnv } from '../../App/api/env';
import {
    lagAInntektLink,
    lagArbeidsforholdLink,
    lagGosysLink,
    lagModiaLink,
} from '../Lenker/Lenker';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';
import Endringslogg from '@navikt/familie-endringslogg';
import { harTilgangTilRolle } from '../../App/utils/roller';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName, Toggles } from '../../App/context/toggles';
import { Sticky } from '../Visningskomponenter/Sticky';

export interface IHeaderMedSøkProps {
    innloggetSaksbehandler: ISaksbehandler;
}

const lagAInntekt = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined
): PopoverItem => {
    if (!fagsakPersonId && !fagsakId) {
        return { name: 'A-inntekt', href: appEnv.aInntekt, isExternal: true };
    }

    return {
        name: 'A-inntekt',
        href: '#/a-inntekt',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(await lagAInntektLink(axiosRequest, appEnv, fagsakId, fagsakPersonId));
        },
    };
};

export const lagAInntektArbeidsforhold = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined
): PopoverItem => {
    if (!fagsakId) {
        return { name: 'Arbeidsforhold', href: appEnv.aInntekt, isExternal: true };
    }

    return {
        name: 'Arbeidsforhold',
        href: '#/arbeidsforhold',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(await lagArbeidsforholdLink(axiosRequest, appEnv, fagsakId));
        },
    };
};

const lagGosys = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return { name: 'Gosys', href: appEnv.gosys, isExternal: true };
    }

    return {
        name: 'Gosys',
        href: '#/gosys',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(lagGosysLink(appEnv, personIdent));
        },
    };
};

const lagModia = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return { name: 'Modia', href: appEnv.modia, isExternal: true };
    }

    return {
        name: 'Modia',
        href: '#/modia',
        onClick: async (e: React.SyntheticEvent) => {
            e.preventDefault();
            window.open(lagModiaLink(appEnv, personIdent));
        },
    };
};

const lagHistoriskPensjon = (appEnv: AppEnv): PopoverItem => {
    return {
        name: 'Vedtak før des. 2008 (Historisk pensjon)',
        href: appEnv.historiskPensjon,
        isExternal: true,
    };
};

const lagDrek = (appEnv: AppEnv): PopoverItem => {
    return {
        name: 'Rekvirere D-nummer',
        href: appEnv.drek,
        isExternal: true,
    };
};

const lagEksterneLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    innloggetSaksbehandler: ISaksbehandler,
    toggles: Toggles,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined,
    personIdent: string | undefined
): PopoverItem[] => {
    const eksterneLenker = [
        lagAInntekt(axiosRequest, appEnv, fagsakId, fagsakPersonId),
        lagGosys(appEnv, personIdent),
        lagModia(appEnv, personIdent),
        lagHistoriskPensjon(appEnv),
        lagDrek(appEnv),
    ];
    if (harTilgangTilRolle(appEnv, innloggetSaksbehandler, 'saksbehandler')) {
        eksterneLenker.push({
            name: 'Uttrekk arbeidssøkere (P43)',
            href: '/uttrekk/arbeidssoker',
        });
        eksterneLenker.push({
            name: 'Opprett førstegangsbehandling manuelt',
            href: '/opprett-forstegangsbehandling',
        });
        if (toggles[ToggleName.opprettBehandlingForFerdigstiltJournalpost]) {
            eksterneLenker.push({
                name: '[Admin] Lag behandling fra journalpost',
                href: '/admin/ny-behandling-for-ferdigstilt-journalpost',
            });
        }
        eksterneLenker.push({
            name: '[Admin] Vis gamle behandlinger',
            href: '/admin/gamle-behandlinger',
        });
    }
    return eksterneLenker;
};

export const HeaderMedSøk: React.FunctionComponent<IHeaderMedSøkProps> = ({
    innloggetSaksbehandler,
}) => {
    const { axiosRequest, appEnv, valgtFagsakId, valgtFagsakPersonId, personIdent } = useApp();
    const { toggles } = useToggles();
    const eksterneLenker = useMemo(
        () =>
            lagEksterneLenker(
                axiosRequest,
                appEnv,
                innloggetSaksbehandler,
                toggles,
                valgtFagsakId,
                valgtFagsakPersonId,
                personIdent
            ),
        [
            axiosRequest,
            appEnv,
            innloggetSaksbehandler,
            valgtFagsakId,
            valgtFagsakPersonId,
            personIdent,
            toggles,
        ]
    );

    return (
        <Sticky>
            <Header
                tittelHref={'/'}
                tittel="NAV Enslig mor eller far"
                brukerinfo={{
                    navn: innloggetSaksbehandler?.displayName || 'Ukjent',
                }}
                brukerPopoverItems={[{ name: 'Logg ut', href: `${window.origin}/auth/logout` }]}
                eksterneLenker={eksterneLenker}
            >
                {innloggetSaksbehandler && <PersonSøk />}
                {innloggetSaksbehandler?.navIdent && (
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
        </Sticky>
    );
};
