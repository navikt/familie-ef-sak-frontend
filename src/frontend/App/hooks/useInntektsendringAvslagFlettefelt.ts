import { Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import {
    beregnTiProsentReduksjonIMånedsinntekt,
    beregnTiProsentØkningIMånedsinntekt,
    EBehandlingFlettefelt,
    FlettefeltStore,
} from './useVerdierForBrev';
import {
    EAvslagÅrsak,
    EBehandlingResultat,
    IInnvilgeVedtakForOvergangsstønad,
    IVedtakForOvergangsstønad,
    IVedtakType,
} from '../typer/vedtak';
import { formaterTallMedTusenSkille } from '../utils/formatter';
import { useHentVedtak } from './useHentVedtak';

export const useInntektsendringAvslagFlettefelt = (
    behandlingId: string,
    forrigeBehandlingId: string | undefined,
    leggTilNyeFlettefelt: (nyeFlettefelt: FlettefeltStore) => void
) => {
    const { axiosRequest } = useApp();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    const settFlettefeltForAvslagMindreInntektsøkning = useCallback(() => {
        if (
            vedtak.status === RessursStatus.SUKSESS &&
            vedtak.data?.resultatType === EBehandlingResultat.AVSLÅ &&
            vedtak.data.avslåÅrsak === EAvslagÅrsak.MINDRE_INNTEKTSENDRINGER
        ) {
            const behandlingConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/${forrigeBehandlingId}`,
            };

            axiosRequest<IVedtakForOvergangsstønad | undefined, string>(behandlingConfig).then(
                (res: Ressurs<IVedtakForOvergangsstønad | undefined>) => {
                    if (
                        res.status === RessursStatus.SUKSESS &&
                        (res.data as IVedtakForOvergangsstønad)._type ===
                            IVedtakType.InnvilgelseOvergangsstønad
                    ) {
                        const vedtaksData = res.data as IInnvilgeVedtakForOvergangsstønad;
                        const nåværendeInntekt =
                            vedtaksData.inntekter[vedtaksData.inntekter.length - 1]
                                .forventetInntekt;

                        if (nåværendeInntekt) {
                            const tiProsentØkning =
                                beregnTiProsentØkningIMånedsinntekt(nåværendeInntekt);
                            const tiProsentReduksjon =
                                beregnTiProsentReduksjonIMånedsinntekt(nåværendeInntekt);

                            leggTilNyeFlettefelt({
                                [EBehandlingFlettefelt.navarendeArsinntekt]:
                                    formaterTallMedTusenSkille(nåværendeInntekt),
                                [EBehandlingFlettefelt.manedsinntektTiProsentOkning]:
                                    tiProsentØkning,
                                [EBehandlingFlettefelt.manedsinntektTiProsentReduksjon]:
                                    tiProsentReduksjon,
                            });
                        }
                    }
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vedtak, axiosRequest]);

    return {
        settFlettefeltForAvslagMindreInntektsøkning,
    };
};
