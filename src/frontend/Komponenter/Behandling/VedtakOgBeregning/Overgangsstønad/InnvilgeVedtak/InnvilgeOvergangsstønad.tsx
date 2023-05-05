import React, { useCallback, useState } from 'react';
import { IInnvilgeVedtakForOvergangsstønad } from '../../../../../App/typer/vedtak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../App/typer/ressurs';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { useApp } from '../../../../../App/context/AppContext';
import { Behandling } from '../../../../../App/typer/fagsak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { revurdererFraPeriodeUtenStønad } from './revurderFraUtils';
import { RevurderesFraOgMed } from '../../Felles/RevurderesFraOgMed';
import { IVilkår } from '../../../Inngangsvilkår/vilkår';
import { Vedtaksform } from './Vedtaksform';
import { oppdaterVedtakMedEndretKey, oppdaterVedtakMedInitPeriodeOgOpphørshull } from './utils';

export const InnvilgeOvergangsstønad: React.FC<{
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

    const hentVedtakshistorikk = useCallback(
        (revurderesFra: string) => {
            axiosRequest<IInnvilgeVedtakForOvergangsstønad, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/fagsak/${behandling.fagsakId}/historikk/${revurderesFra}`,
            }).then((res: RessursSuksess<IInnvilgeVedtakForOvergangsstønad> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    const oppdatertVedtakMedEndretKey = oppdaterVedtakMedEndretKey(res.data);
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
                    revurdererFraPeriodeUtenStønad={revurdererFraPeriodeUtenStønad(
                        vedtak,
                        revurderesFra
                    )}
                    stønadstype={behandling.stønadstype}
                />
            ) : null}
            {(vedtak || !behandling.forrigeBehandlingId) && (
                <Vedtaksform
                    behandling={behandling}
                    lagretVedtak={vedtak}
                    vilkår={vilkår}
                    revurderesFra={revurderesFra}
                />
            )}
        </>
    );
};
