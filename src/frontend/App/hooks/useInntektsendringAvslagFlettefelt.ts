import { Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback } from 'react';
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
    IVedtak,
    IVedtakForOvergangsstønad,
    IVedtakType,
} from '../typer/vedtak';
import { formaterTallMedTusenSkille } from '../utils/formatter';

export const useInntektsendringAvslagFlettefelt = (
    forrigeBehandlingId: string | undefined,
    leggTilNyeFlettefelt: (nyeFlettefelt: FlettefeltStore) => void,
    vedtak: Ressurs<IVedtak | undefined>
) => {
    const { axiosRequest } = useApp();

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

                        if (nåværendeInntekt && typeof nåværendeInntekt === 'number') {
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
    }, [vedtak, axiosRequest]);

    return {
        settFlettefeltForAvslagMindreInntektsøkning,
    };
};
