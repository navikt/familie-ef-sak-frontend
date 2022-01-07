import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { EBehandlingResultat, IVedtak } from '../typer/vedtak';

export const harVedtaksresultatMedTilkjentYtelse = (
    vedtaksresultat: EBehandlingResultat | undefined
): boolean => {
    if (vedtaksresultat) {
        return (
            vedtaksresultat === EBehandlingResultat.INNVILGE ||
            vedtaksresultat === EBehandlingResultat.OPPHØRT
        );
    }
    return false;
};

export const useHentVedtak = (
    behandlingId: string
): {
    hentVedtak: () => void;
    vedtak: Ressurs<IVedtak | undefined>;
    vedtaksresultat: EBehandlingResultat | undefined;
} => {
    const { axiosRequest } = useApp();
    const [vedtak, settVedtak] = useState<Ressurs<IVedtak | undefined>>(byggTomRessurs());
    const [vedtaksresultat, settVedtaksresultat] = useState<EBehandlingResultat>();

    const hentVedtak = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}`,
        };
        axiosRequest<IVedtak | undefined, null>(behandlingConfig).then(
            (res: Ressurs<IVedtak | undefined>) => {
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
