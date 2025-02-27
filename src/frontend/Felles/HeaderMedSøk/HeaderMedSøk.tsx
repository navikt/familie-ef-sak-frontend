import React, { useMemo } from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import { useApp } from '../../App/context/AppContext';
import './headermedsøk.less';
import { AppEnv } from '../../App/api/env';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';
import Endringslogg from '@navikt/familie-endringslogg';
import { harTilgangTilRolle } from '../../App/utils/roller';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { Sticky } from '../Visningskomponenter/Sticky';
import { lagArbeidsverktøyLenker, lagEksterneLenker, lagInterneLenker } from './utils';

export interface Props {
    innloggetSaksbehandler: ISaksbehandler;
}
export const HeaderMedSøk: React.FunctionComponent<Props> = ({ innloggetSaksbehandler }) => {
    const { axiosRequest, appEnv, valgtFagsakId, valgtFagsakPersonId, personIdent } = useApp();
    const { toggles } = useToggles();
    const erSaksbehandler = harTilgangTilRolle(appEnv, innloggetSaksbehandler, 'saksbehandler');
    const kanOppretteBehandlingForFerdigstiltJournalpost =
        toggles[ToggleName.opprettBehandlingForFerdigstiltJournalpost];
    const visSamværskalkulator = toggles[ToggleName.visSamværskalkulator];

    const headerLenker = useMemo(
        () =>
            lagHeaderLenker(
                axiosRequest,
                appEnv,
                kanOppretteBehandlingForFerdigstiltJournalpost,
                visSamværskalkulator,
                erSaksbehandler,
                valgtFagsakId,
                valgtFagsakPersonId,
                personIdent
            ),
        [
            axiosRequest,
            appEnv,
            valgtFagsakId,
            valgtFagsakPersonId,
            personIdent,
            erSaksbehandler,
            kanOppretteBehandlingForFerdigstiltJournalpost,
            visSamværskalkulator,
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
                eksterneLenker={headerLenker}
            >
                {innloggetSaksbehandler && <PersonSøk />}
                {innloggetSaksbehandler?.navIdent && (
                    <Endringslogg
                        userId={innloggetSaksbehandler.navIdent}
                        dataFetchingIntervalSeconds={60 * 15}
                        appId={'EF'}
                        backendUrl={'/familie-endringslogg'}
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

const lagHeaderLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    kanOppretteBehandlingForFerdigstiltJournalpost: boolean,
    visSamværskalkulator: boolean,
    erSaksbehandler: boolean,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined,
    personIdent: string | undefined
): PopoverItem[] => {
    const interneLenker = erSaksbehandler
        ? lagInterneLenker(kanOppretteBehandlingForFerdigstiltJournalpost)
        : [];

    const eksterneLenker = lagEksterneLenker(
        axiosRequest,
        appEnv,
        fagsakId,
        fagsakPersonId,
        personIdent
    );

    const arbeidsverktøyLenker = visSamværskalkulator ? lagArbeidsverktøyLenker() : [];

    return eksterneLenker.concat(interneLenker).concat(arbeidsverktøyLenker);
};
