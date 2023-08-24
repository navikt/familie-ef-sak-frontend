import React, { useCallback, useState } from 'react';
import { IInnvilgeVedtakForOvergangsstønad } from '../../../../../App/typer/vedtak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../App/typer/ressurs';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useApp } from '../../../../../App/context/AppContext';
import { Behandling } from '../../../../../App/typer/fagsak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { RevurderesFraOgMed } from '../../Felles/RevurderesFraOgMed';
import { IVilkår } from '../../../Inngangsvilkår/vilkår';
import { InnvilgeOvergangsstønad } from './InnvilgeOvergangsstønad';
import {
    oppdaterVedtakMedEndretKey,
    oppdaterVedtakMedInitPeriodeOgOpphørshull,
} from '../Felles/utils';
import { revurdererFraPeriodeUtenStønad } from '../Felles/revurderFraUtils';

export const InnvilgeVedtak: React.FC<{
    behandling: Behandling;
    lagretVedtak?: IInnvilgeVedtakForOvergangsstønad;
    vilkår: IVilkår;
}> = ({ behandling, lagretVedtak, vilkår }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, settIkkePersistertKomponent } = useApp();
    const [vedtak, settVedtak] = useState<IInnvilgeVedtakForOvergangsstønad | undefined>(
        oppdaterVedtakMedEndretKey(lagretVedtak)
    );
    const [revurderesFra, settRevurderesFra] = useState(
        behandling.forrigeBehandlingId && lagretVedtak?.perioder.length
            ? lagretVedtak.perioder[0].årMånedFra
            : undefined
    );
    const [revurderesFraOgMedFeilmelding, settRevurderesFraOgMedFeilmelding] = useState<
        string | null
    >(null);
    const [revurderersFraPeriodeUtenStønad, settRevurderersFraPeriodeUtenStønad] =
        useState<boolean>(revurdererFraPeriodeUtenStønad(lagretVedtak, revurderesFra));

    const hentVedtakshistorikk = useCallback(
        (revurderesFra: string) => {
            axiosRequest<IInnvilgeVedtakForOvergangsstønad, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/fagsak/${behandling.fagsakId}/historikk/${revurderesFra}`,
            }).then((res: RessursSuksess<IInnvilgeVedtakForOvergangsstønad> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    const oppdatertVedtakMedEndretKey = oppdaterVedtakMedEndretKey(res.data);
                    settRevurderersFraPeriodeUtenStønad(
                        revurdererFraPeriodeUtenStønad(oppdatertVedtakMedEndretKey, revurderesFra)
                    );
                    settVedtak(
                        oppdaterVedtakMedInitPeriodeOgOpphørshull(
                            oppdatertVedtakMedEndretKey,
                            revurderesFra
                        )
                    );
                } else {
                    settRevurderesFraOgMedFeilmelding(res.frontendFeilmelding);
                }
            });
        },
        // eslint-disable-next-line
        [axiosRequest, behandling]
    );

    return (
        <>
            {behandling.forrigeBehandlingId && behandlingErRedigerbar ? (
                <RevurderesFraOgMed
                    settRevurderesFra={settRevurderesFra}
                    hentVedtakshistorikk={hentVedtakshistorikk}
                    revurderesFra={revurderesFra}
                    feilmelding={revurderesFraOgMedFeilmelding}
                    revurdererFraPeriodeUtenStønad={revurderersFraPeriodeUtenStønad}
                    stønadstype={behandling.stønadstype}
                />
            ) : null}
            {(vedtak || !behandling.forrigeBehandlingId) && (
                <InnvilgeOvergangsstønad
                    behandling={behandling}
                    lagretVedtak={vedtak}
                    vilkår={vilkår}
                    revurderesFra={revurderesFra}
                />
            )}
        </>
    );
};
