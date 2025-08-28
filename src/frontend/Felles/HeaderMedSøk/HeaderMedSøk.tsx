import React, { useMemo } from 'react';
import { Header } from '@navikt/familie-header';
import PersonSøk from './PersonSøk';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import { useApp } from '../../App/context/AppContext';
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
    const skalViseBeregningsskjemaLenke = toggles[ToggleName.visBeregningsskjema];

    const headerLenker = useMemo(
        () =>
            lagHeaderLenker(
                axiosRequest,
                appEnv,
                kanOppretteBehandlingForFerdigstiltJournalpost,
                erSaksbehandler,
                valgtFagsakId,
                valgtFagsakPersonId,
                personIdent,
                skalViseBeregningsskjemaLenke
            ),
        [
            axiosRequest,
            appEnv,
            kanOppretteBehandlingForFerdigstiltJournalpost,
            erSaksbehandler,
            valgtFagsakId,
            valgtFagsakPersonId,
            personIdent,
            skalViseBeregningsskjemaLenke,
        ]
    );

    const erDev =
        window.location.href.includes('dev') || window.location.href.includes('localhost');

    return (
        <Sticky>
            <Header
                tittelHref={'/'}
                tittel="Nav Enslig mor eller far"
                brukerinfo={{
                    navn: innloggetSaksbehandler?.displayName || 'Ukjent',
                }}
                brukerPopoverItems={[{ name: 'Logg ut', href: `${window.origin}/auth/logout` }]}
                eksterneLenker={headerLenker}
                erDev={erDev}
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
    erSaksbehandler: boolean,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined,
    personIdent: string | undefined,
    skalViseBeregningsskjemaLenke: boolean
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

    const arbeidsverktøyLenker = lagArbeidsverktøyLenker(
        fagsakPersonId,
        skalViseBeregningsskjemaLenke
    );

    return eksterneLenker.concat(interneLenker).concat(arbeidsverktøyLenker);
};
