import { EBehandlingResultat, IvedtakForBarnetilsyn } from '../../../../App/typer/vedtak';
import { revurdererFraPeriodeUtenStønad } from './revurderFraUtils';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { useApp } from '../../../../App/context/AppContext';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../App/typer/ressurs';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { RevurderesFraOgMed } from '../Felles/RevurderesFraOgMed';
import { Vedtaksform } from './Vedtaksform';
import { oppdaterVedtakMedEndretKey, oppdaterVedtakMedInitPeriodeOgOpphørshulll } from './utils';
import { IKontantstøtteUtbetalinger } from './KontantstøtteValg';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../../App/hooks/felles/useDataHenter';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';

// TODO backend må returnere InnvilgelseBarnetilsynUtenUtbetaling ?
export const InnvilgeBarnetilsyn: FC<{
    behandling: Behandling;
    lagretVedtak?: IvedtakForBarnetilsyn;
    barn: IBarnMedSamvær[];
    settResultatType: (val: EBehandlingResultat | undefined) => void;
}> = ({ behandling, lagretVedtak, barn, settResultatType }) => {
    const { axiosRequest, settIkkePersistertKomponent } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const [vedtakshistorikk, settVedtakshistorikk] = useState<IvedtakForBarnetilsyn>();
    const [revurderesFra, settRevurderesFra] = useState(
        behandling.forrigeBehandlingId && lagretVedtak?.perioder.length
            ? lagretVedtak.perioder[0].årMånedFra
            : undefined
    );
    const [revurderesFraOgMedFeilmelding, settRevurderesFraOgMedFeilmelding] = useState<
        string | null
    >(null);
    const [revurderesFraPeriodeUtenStønad, settRevurderesFraPeriodeUtenStønad] = useState(false);

    const hentVedtakshistorikk = useCallback(
        (revurderesFra: string) => {
            axiosRequest<IvedtakForBarnetilsyn, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/${behandling.id}/historikk/${revurderesFra}`,
            }).then((res: RessursSuksess<IvedtakForBarnetilsyn> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    settVedtakshistorikk(
                        oppdaterVedtakMedInitPeriodeOgOpphørshulll(res.data, revurderesFra)
                    );
                    settRevurderesFraPeriodeUtenStønad(
                        revurdererFraPeriodeUtenStønad(res.data, revurderesFra)
                    );
                } else {
                    settRevurderesFraOgMedFeilmelding(res.frontendFeilmelding);
                }
            });
        },
        // eslint-disable-next-line
        [axiosRequest, behandling]
    );

    const hentKsUtbetalinger: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/kontantstotte/${behandling.id}/finnesUtbetalinger`,
        }),
        [behandling]
    );
    const kontantstøtteUtbetalinger = useDataHenter<IKontantstøtteUtbetalinger, null>(
        hentKsUtbetalinger
    );

    const vedtak = useMemo(
        () => oppdaterVedtakMedEndretKey(vedtakshistorikk || lagretVedtak),
        [vedtakshistorikk, lagretVedtak]
    );

    return (
        <>
            {behandling.forrigeBehandlingId && behandlingErRedigerbar && (
                <RevurderesFraOgMed
                    settRevurderesFra={settRevurderesFra}
                    revurderesFra={revurderesFra}
                    hentVedtakshistorikk={hentVedtakshistorikk}
                    feilmelding={revurderesFraOgMedFeilmelding}
                    revurdererFraPeriodeUtenStønad={revurderesFraPeriodeUtenStønad}
                    stønadstype={behandling.stønadstype}
                />
            )}
            {(!behandling.forrigeBehandlingId || vedtak) && (
                <DataViewer response={{ kontantstøtteUtbetalinger }}>
                    {({ kontantstøtteUtbetalinger }) => (
                        <Vedtaksform
                            behandling={behandling}
                            lagretVedtak={vedtak}
                            barn={barn}
                            settResultatType={settResultatType}
                            låsFraDatoFørsteRad={!!revurderesFra}
                            harKontantstøtteUtbetalinger={
                                kontantstøtteUtbetalinger.finnesUtbetaling
                            }
                        />
                    )}
                </DataViewer>
            )}
        </>
    );
};
