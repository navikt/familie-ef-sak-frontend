import {
    EBehandlingResultat,
    IInnvilgeVedtakForBarnetilsyn,
    IUtgiftsperiode,
    IvedtakForBarnetilsyn,
} from '../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import {
    fyllHullMedOpphør,
    revurdererFørFørstePeriode,
    revurderFraInitPeriode,
} from './revurderFraUtils';
import React, { FC, useCallback, useState } from 'react';
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

const oppdaterVedtakMedEndretKey = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined
): IInnvilgeVedtakForBarnetilsyn | undefined => {
    if (!vedtak) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: vedtak.perioder.map((periode) => ({ ...periode, endretKey: uuidv4() })),
        perioderKontantstøtte: vedtak.perioderKontantstøtte.map((periode) => ({
            ...periode,
            endretKey: uuidv4(),
        })),
        tilleggsstønad: {
            ...vedtak.tilleggsstønad,
            perioder: vedtak.tilleggsstønad.perioder.map((periode) => ({
                ...periode,
                endretKey: uuidv4(),
            })),
        },
    };
};

const oppdaterVedtakMedInitPeriodeOgOpphørshulll = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined,
    revurderesFra: string
): IInnvilgeVedtakForBarnetilsyn | undefined => {
    if (!vedtak) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: [
            ...revurderFraInitPeriode(vedtak, revurderesFra),
            ...vedtak.perioder.reduce(fyllHullMedOpphør, [] as IUtgiftsperiode[]),
        ],
    };
};

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

    const vedtak = vedtakshistorikk || lagretVedtak;

    return (
        <>
            {toggle && behandling.forrigeBehandlingId && behandlingErRedigerbar && (
                <RevurderesFraOgMed
                    settRevurderesFra={settRevurderesFra}
                    revurderesFra={revurderesFra}
                    feilmelding={revurderesFraOgMedFeilmelding}
                    revurdererFørFørstePeriode={revurdererFørFørstePeriode(
                        vedtakshistorikk,
                        revurderesFra
                    )}
                />
            )}
            {(!toggle || !behandling.forrigeBehandlingId || vedtak) && (
                <Vedtaksform
                    behandling={behandling}
                    lagretVedtak={oppdaterVedtakMedEndretKey(vedtak)}
                    barn={barn}
                    settResultatType={settResultatType}
                />
            )}
        </>
    );
};
