import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { EBehandlingResultat, IVedtak } from '../typer/vedtak';

export const useHentVedtak = (
    behandlingId: string
): {
    hentVedtak: () => void;
    vedtak: Ressurs<IVedtak | undefined>;
    vedtaksresultat: EBehandlingResultat | undefined;
    harVedtaksresultatMedTilkjentYtelse: () => boolean;
} => {
    const { axiosRequest } = useApp();
    const [vedtak, settVedtak] = useState<Ressurs<IVedtak | undefined>>(byggTomRessurs());
    const [vedtaksresultat, settVedtaksresultat] = useState<EBehandlingResultat>();

    const harVedtaksresultatMedTilkjentYtelse = (): boolean => {
        if (vedtaksresultat) {
            return (
                vedtaksresultat === EBehandlingResultat.INNVILGE ||
                vedtaksresultat === EBehandlingResultat.OPPHØRT
            );
        }
        return false;
    };

    const hentVedtak = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}`,
        };
        axiosRequest<IVedtak | undefined, null>(behandlingConfig).then(
            (res: Ressurs<IVedtak | undefined>) => {
                settVedtak(res);
                const resultatType =
                    vedtak.status === RessursStatus.SUKSESS && vedtak.data
                        ? vedtak.data.resultatType
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
        harVedtaksresultatMedTilkjentYtelse,
    };
};
