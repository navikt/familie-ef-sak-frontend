import { EBehandlingResultat, IvedtakForBarnetilsyn } from '../../../../../App/typer/vedtak';
import { revurdererFraPeriodeUtenStønad } from '../Felles/revurderFraUtils';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Behandling } from '../../../../../App/typer/fagsak';
import { IBarnMedSamvær } from '../../../Inngangsvilkår/Aleneomsorg/typer';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../App/typer/ressurs';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { RevurderesFraOgMed } from '../../Felles/RevurderesFraOgMed';
import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import {
    oppdaterVedtakMedEndretKey,
    oppdaterVedtakMedInitPeriodeOgOpphørshulll,
} from '../Felles/utils';
import { KontantstøttePeriode } from '../../../Inngangsvilkår/vilkår';

// TODO backend må returnere InnvilgelseBarnetilsynUtenUtbetaling ?
export const InnvilgeVedtak: FC<{
    behandling: Behandling;
    lagretVedtak?: IvedtakForBarnetilsyn;
    barn: IBarnMedSamvær[];
    settResultatType: (val: EBehandlingResultat | undefined) => void;
    harKontantstøttePerioder?: boolean;
    kontantstøttePerioderFraGrunnlagsdata: KontantstøttePeriode[];
    registeropplysningerOpprettetTid: string;
}> = ({
    behandling,
    lagretVedtak,
    barn,
    settResultatType,
    harKontantstøttePerioder,
    kontantstøttePerioderFraGrunnlagsdata,
    registeropplysningerOpprettetTid,
}) => {
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
            settVedtakshistorikk(undefined);
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

        [axiosRequest, behandling]
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
                <InnvilgeBarnetilsyn
                    behandling={behandling}
                    lagretVedtak={vedtak}
                    barn={barn}
                    settResultatType={settResultatType}
                    låsFraDatoFørsteRad={!!revurderesFra}
                    harKontantstøttePerioder={harKontantstøttePerioder}
                    kontantstøttePerioderFraGrunnlagsdata={kontantstøttePerioderFraGrunnlagsdata}
                    registeropplysningerOpprettetTid={registeropplysningerOpprettetTid}
                />
            )}
        </>
    );
};
