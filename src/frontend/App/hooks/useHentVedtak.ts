import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { EBehandlingResultat, IVedtakForOvergangsstønad } from '../typer/vedtak';

export const harVedtaksresultatMedTilkjentYtelse = (
    vedtaksresultat: EBehandlingResultat | undefined
): boolean => {
    if (vedtaksresultat) {
        return (
            vedtaksresultat === EBehandlingResultat.INNVILGE ||
            vedtaksresultat === EBehandlingResultat.INNVILGE_UTEN_UTBETALING ||
            vedtaksresultat === EBehandlingResultat.SANKSJONERE ||
            vedtaksresultat === EBehandlingResultat.OPPHØRT
        );
    }
    return false;
};

export const useHentVedtak = (
    behandlingId: string
): {
    hentVedtak: () => void;
    vedtak: Ressurs<IVedtakForOvergangsstønad | undefined>;
    vedtaksresultat: EBehandlingResultat | undefined;
} => {
    const { axiosRequest } = useApp();
    const [vedtak, settVedtak] = useState<Ressurs<IVedtakForOvergangsstønad | undefined>>(
        byggTomRessurs()
    );
    const [vedtaksresultat, settVedtaksresultat] = useState<EBehandlingResultat>();

    const hentVedtak = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}`,
        };
        axiosRequest<IVedtakForOvergangsstønad | undefined, null>(behandlingConfig).then(
            (res: Ressurs<IVedtakForOvergangsstønad | undefined>) => {
                settVedtak(res);
                const resultatType =
                    res.status === RessursStatus.SUKSESS && res.data
                        ? res.data.resultatType
                        : undefined;
                settVedtaksresultat(resultatType);
            }
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        hentVedtak,
        vedtak,
        vedtaksresultat,
    };
};
