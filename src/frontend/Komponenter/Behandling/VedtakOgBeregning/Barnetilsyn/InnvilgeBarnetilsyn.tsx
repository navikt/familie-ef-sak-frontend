import { EBehandlingResultat, IvedtakForBarnetilsyn } from '../../../../App/typer/vedtak';
import { revurdererFraPeriodeUtenStønad } from './revurderFraUtils';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { useToggles } from '../../../../App/context/TogglesContext';
import { useApp } from '../../../../App/context/AppContext';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { ToggleName } from '../../../../App/context/toggles';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../App/typer/ressurs';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { useEffectNotInitialRender } from '../../../../App/hooks/felles/useEffectNotInitialRender';
import { RevurderesFraOgMed } from '../Felles/RevurderesFraOgMed';
import { Vedtaksform } from './Vedtaksform';
import { oppdaterVedtakMedEndretKey, oppdaterVedtakMedInitPeriodeOgOpphørshulll } from './utils';

// TODO backend må returnere InnvilgelseBarnetilsynUtenUtbetaling ?
export const InnvilgeBarnetilsyn: FC<{
    behandling: Behandling;
    lagretVedtak?: IvedtakForBarnetilsyn;
    barn: IBarnMedSamvær[];
    settResultatType: (val: EBehandlingResultat | undefined) => void;
}> = ({ behandling, lagretVedtak, barn, settResultatType }) => {
    const { toggles } = useToggles();
    const { axiosRequest, settIkkePersistertKomponent } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const toggle = toggles[ToggleName.revurderFraBarnetilsyn];
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

    useEffectNotInitialRender(() => {
        if (!revurderesFra) return;

        hentVedtakshistorikk(revurderesFra);
    }, [revurderesFra, hentVedtakshistorikk]);

    const vedtak = useMemo(
        () => oppdaterVedtakMedEndretKey(vedtakshistorikk || lagretVedtak),
        [vedtakshistorikk, lagretVedtak]
    );

    return (
        <>
            {toggle && behandling.forrigeBehandlingId && behandlingErRedigerbar && (
                <RevurderesFraOgMed
                    settRevurderesFra={settRevurderesFra}
                    revurderesFra={revurderesFra}
                    feilmelding={revurderesFraOgMedFeilmelding}
                    revurdererFraPeriodeUtenStønad={revurderesFraPeriodeUtenStønad}
                    type={'BARNETILSYN'}
                />
            )}
            {(!toggle || !behandling.forrigeBehandlingId || vedtak) && (
                <Vedtaksform
                    behandling={behandling}
                    lagretVedtak={vedtak}
                    barn={barn}
                    settResultatType={settResultatType}
                    låsFraDatoFørsteRad={!!revurderesFra}
                />
            )}
        </>
    );
};
