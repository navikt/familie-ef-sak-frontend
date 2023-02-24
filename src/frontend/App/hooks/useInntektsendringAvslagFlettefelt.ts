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
    IInnvilgeVedtakForOvergangsstønad,
    IVedtakForOvergangsstønad,
    IVedtakType,
} from '../typer/vedtak';

export const useInntektsendringAvslagFlettefelt = (
    forrigeBehandlingId: string | undefined,
    leggTilNyeFlettefelt: (nyeFlettefelt: FlettefeltStore) => void
) => {
    const { axiosRequest } = useApp();

    const settFlettefeltForAvslagMindreInntektsøkning = useCallback(() => {
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
                        vedtaksData.inntekter[vedtaksData.inntekter.length - 1].forventetInntekt;

                    if (nåværendeInntekt) {
                        const tiProsentØkning =
                            beregnTiProsentØkningIMånedsinntekt(nåværendeInntekt);
                        const tiProsentReduksjon =
                            beregnTiProsentReduksjonIMånedsinntekt(nåværendeInntekt);

                        leggTilNyeFlettefelt({
                            [EBehandlingFlettefelt.navarendeArsinntekt]:
                                nåværendeInntekt.toString(),
                            [EBehandlingFlettefelt.manedsinntektTiProsentOkning]:
                                tiProsentØkning.toString(),
                            [EBehandlingFlettefelt.manedsinntektTiProsentReduksjon]:
                                tiProsentReduksjon.toString(),
                        });
                    }
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forrigeBehandlingId, axiosRequest]);

    return {
        settFlettefeltForAvslagMindreInntektsøkning,
    };
};
